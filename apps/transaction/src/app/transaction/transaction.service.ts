import { Injectable, ForbiddenException, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionEntity } from './entities/transaction.entity';
import { ITransaction, FlowType, AccountType } from '@moneytracker/interfaces';
import { TransactionEventEmitter } from './transaction.event-emitter';
import { AccountGet, AccountList, CategoryGet, CreditGetAvailable, CreditPeriodDebt, CreditPeriodGet, TransactionCreate, TransactionUpdate } from '@moneytracker/contracts';
import { RMQService } from 'nestjs-rmq';

@Injectable()
export class TransactionService {
  constructor(
    private readonly repo: TransactionRepository,
    private readonly events: TransactionEventEmitter,
    private readonly rmq: RMQService
  ) {}
  private readonly logger = new Logger(TransactionService.name);

  /** Проверяет, что по данной кредитке и periodId можно провести операцию amount на дату dateOnly */
  private async validateCreditPeriod(
    userId: string,
    accountId: string,
    periodId: string | undefined,
    dateOnly: Date,
    amount: number,
    action: 'income' | 'transfer',
    peers: string[]
  ) {

    // 1. Получаем сам счёт, убеждаемся, что это кредитка
    const { account } = await this.rmq.send<AccountGet.Request, AccountGet.Response>(
      AccountGet.topic, { userId, id: accountId, peers }
    );
    if (account.type !== AccountType.CreditCard) return;
    this.logger.log(`Это кредитная карта`);

    if (!periodId) {
      this.logger.log(`Нет periodId`);
      throw new BadRequestException(`periodId required for ${action} on credit card`);
    }
    this.logger.log(`Есть periodId`);
    
    // 2. Запрашиваем период
    const { period } = await this.rmq.send<
      CreditPeriodGet.Request,
      CreditPeriodGet.Response
    >(CreditPeriodGet.topic, { accountId, periodId });
    this.logger.log(`Запросили период`);

    const stmtEnd = new Date(period.statementEnd);
    const payDue  = new Date(period.paymentDue);
  
    // 3) проверяем границы: statementEnd ≤ date
    if (stmtEnd > dateOnly) {
      throw new BadRequestException('Date is before the start of the specified payment-period');
    }
    // 4) если статус=payment — дополнительно date ≤ paymentDue
    if (period.status === 'payment' && dateOnly > payDue) {
      throw new BadRequestException('Date is after paymentDue for this period');
    }
    // 5) статус должен быть payment|overdue
    if (period.status !== 'payment' && period.status !== 'overdue') {
      throw new BadRequestException('Specified period is not in payment or overdue');
    }
    this.logger.log(`Проверили statementEnd и статус`);

    // 4. Проверяем остаток долга
    // Если период в статусе PAYMENT — проверяем debt >= amount
  // Если OVERDUE — переплата разрешена, проверку не делаем
  if (period.status === 'payment') {
    const { debt } = await this.rmq.send<
      CreditPeriodDebt.Request,
      CreditPeriodDebt.Response
    >(CreditPeriodDebt.topic, { periodId });
    this.logger.log(`Задолженность = ${debt}`);
    if (debt < amount) {
      throw new BadRequestException(
        action === 'income'
          ? 'Payment amount exceeds outstanding debt'
          : 'Transfer amount exceeds outstanding debt'
      );
    }
  }
    this.logger.log(`Проверили остаток долга`);
  }

  /** Создание транзакции */
  async create(userId: string, dto: TransactionCreate.Request): Promise<TransactionCreate.Response> {
    const peers = dto.peers ?? [];
    this.logger.log(`Начало создания транзакции`);
    // 1. Проверяем счёт
    await this.rmq.send(AccountGet.topic, { userId, id: dto.accountId, peers });
    this.logger.log(`Аваите`);
  
    // 2. Получаем категорию и её тип
    const { category } = await this.rmq.send<CategoryGet.Request, CategoryGet.Response>(
      CategoryGet.topic, { userId, id: dto.categoryId, peers },
    );
    const catType = category.type as FlowType;   // income | expense | transfer
    this.logger.log(`Категория`);
  
    // 3. Валидации transfer-категории
    if (catType === FlowType.Transfer) {
      if (!dto.toAccountId) {
        throw new BadRequestException('toAccountId required for transfer category');
      }
      if (dto.toAccountId === dto.accountId) {
        throw new BadRequestException('toAccountId must differ from accountId');
      }
      // проверяем целевой счёт
      await this.rmq.send(AccountGet.topic, { userId, id: dto.toAccountId, peers });
    } else {
      // non-transfer: toAccountId недопустим
      if (dto.toAccountId) {
        throw new BadRequestException('toAccountId allowed only for transfer category');
      }
      // проверяем категорию
      await this.rmq.send(CategoryGet.topic, { userId, id: dto.categoryId, peers });
    }
    this.logger.log(`Валидация transfer категории`);

    // 5. Определяем, «снимаем» ли мы с кредитки:
    const { account: srcAcc } = await this.rmq.send<
      AccountGet.Request, AccountGet.Response
    >(AccountGet.topic, { userId, id: dto.accountId, peers });
    const sourceIsCredit = srcAcc.type === AccountType.CreditCard;

    // 6. Если expense с кредитки — проверяем «available»
    if ((catType === FlowType.Expense || catType === FlowType.Transfer) && sourceIsCredit) {
      const { available } = await this.rmq.send<
        CreditGetAvailable.Request,
        CreditGetAvailable.Response
      >(CreditGetAvailable.topic, { accountId: dto.accountId });

      if (dto.amount > available) {
        this.logger.log(`${catType} ${dto.amount} ERROR (available=${available})`);
        throw new BadRequestException(
          'Insufficient credit: attempt to spend more than available limit',
        );
      }
      this.logger.log(`${catType} ${dto.amount} OK (available=${available})`);
    }

     // 2) Определяем, когда нужен periodId
    //    — для income по кредитке по accountId
    //    — для transfer на кредитку по toAccountId

    let targetIsCredit = false;
    if (catType === FlowType.Transfer && dto.toAccountId) {
      const { account: tgtAcc } = await this.rmq.send<
        AccountGet.Request, AccountGet.Response
      >(AccountGet.topic, { userId, id: dto.toAccountId, peers });
      targetIsCredit = tgtAcc.type === AccountType.CreditCard;
    }

    // определяем, нужен ли periodId/hasInterest
    const isIncomeOnCredit = catType === FlowType.Income && sourceIsCredit;
    const isTransferToCredit = catType === FlowType.Transfer && targetIsCredit;

    const needsPeriod = isIncomeOnCredit || isTransferToCredit;

    if (needsPeriod && !dto.periodId) {
      throw new BadRequestException('periodId is required for this transaction');
    }
    if (!needsPeriod && dto.periodId) {
      throw new BadRequestException('periodId is not allowed for this transaction');
    }
    // если период не нужен — hasInterest запрещён
    if (!needsPeriod && dto.hasInterest !== undefined) {
      throw new BadRequestException('hasInterest is not allowed for this transaction');
    }
  
    // 4. Нормализуем дату
    const dateOnly = new Date(dto.date);
    dateOnly.setUTCHours(0,0,0,0);
    this.logger.log(`Нормализация даты`);

    // Проверяем для переводов на кредитную карту корректное указание кредитного периода
    if (catType === FlowType.Income) {
      // income по accountId
      await this.validateCreditPeriod(
        userId, dto.accountId, dto.periodId, dateOnly, dto.amount, 'income', peers ?? []
      );
    } else if (catType === FlowType.Transfer && dto.toAccountId) {
      // transfer → toAccountId
      await this.validateCreditPeriod(
        userId, dto.toAccountId, dto.periodId, dateOnly, dto.amount, 'transfer', peers ?? []
      );
    }
    this.logger.log(`Проверено для переводов на кредитную карту корректное указание кредитного периода`);

    // 8. Логика hasInterest для overdue-периода
  if (needsPeriod) {
    // Получим период сразу, чтобы знать его статус и paymentDue
    const { period } = await this.rmq.send<
      CreditPeriodGet.Request,
      CreditPeriodGet.Response
    >(CreditPeriodGet.topic, {
      accountId: isIncomeOnCredit ? dto.accountId : dto.toAccountId!,
      periodId:  dto.periodId!,
    });

    // получим задолженность
    const { debt } = await this.rmq.send<
        CreditPeriodDebt.Request,
        CreditPeriodDebt.Response
      >(CreditPeriodDebt.topic, { periodId: dto.periodId! });

    const stmtEnd = new Date(period.statementEnd);
    const payDue = new Date(period.paymentDue);

    if (stmtEnd <= dateOnly && dateOnly <= payDue) {
      // внутри границы платежного периода переплата не считается
      // 8a) внутри window ([statementEnd..paymentDue]) сумма не может превышать долг
      if (dto.amount > debt) {
        throw new BadRequestException(
          'Transaction amount exceeds outstanding debt for this period'
        );
      }
    }

    // hasInterest разрешён только когда статус overdue и дата > paymentDue
    if (period.status === 'overdue' && dateOnly > payDue) {
      // если overdue, flag обязателен
      if (dto.hasInterest === undefined) {
        throw new BadRequestException('hasInterest is required for overdue-period transactions after paymentDue');
      }
      if (dto.hasInterest) {
        if (dto.amount <= debt) {
          this.logger.log(`hasInterest-проверка не пройдена: true, debt=${debt}, amount=${dto.amount}`);
          throw new BadRequestException('hasInterest=true requires amount > outstanding debt');
        }
      }
    } else {
      // во всех остальных случаях флаг запрещён
      if (dto.hasInterest !== undefined) {
        throw new BadRequestException('hasInterest not allowed for non-overdue transactions or dateOnly <= payDue');
      }
      this.logger.log(`hasInterest не применяется (status=${period.status}, dateOnly=${dateOnly}, paymentDue=${payDue})`);
    }
  }

  // 5. Собираем сущность
  const entity = new TransactionEntity({
    ...dto,
    userId,
    type: catType,
    date: dateOnly,
  })

  const saved = await this.repo.create(entity);
  entity._id = saved._id;
  entity.markCreated();
  await this.events.emit(entity.events);
  return {};
}



  /** Список транзакций со множеством фильтров */
async list(
  userId: string,
  peers: string[] = [],
  type?: FlowType,
  accountIdsFilter: string[] = [],
  userIdsFilter: string[] = [],
  categoryIdsFilter: string[] = [],
  dateFilter?: Date,
  monthFilter?: number,
  yearFilter?: number,
  fromFilter?: Date,
  toFilter?: Date,
): Promise<TransactionEntity[]> {

  /* ----------------------------------------------------------
   * 0. Определяем базовый набор "допустимых" счётов
   *    ─ если вызывающая сторона уже прислала accountIdsFilter
   *      и peers пуст, значит она доверена (это wallet-сервис)
   *      ─ пропускаем шаг с account.list.query, чтобы
   *        не попасть в циклический RPC.
   *    ─ иначе работаем по старой схеме.
   * ---------------------------------------------------------- */

  let accessibleAccountIds: string[];

  if (accountIdsFilter.length && peers.length === 0) {
    // wallet уже дал конкретный счёт – доверяем
    accessibleAccountIds = [...accountIdsFilter];
  } else {
    // стандартная проверка доступа
    const { accounts } = await this.rmq.send<
      AccountList.Request,
      AccountList.Response
    >(AccountList.topic, { userId, peers });

    accessibleAccountIds = accounts
      .filter((a): a is { _id: string } => !!a && !!a._id)
      .map(a => a._id);
  }

  if (accessibleAccountIds.length === 0) return [];

  /* 2. Забираем все транзакции по доступным счётам */
  //let txs = await this.repo.findByAccountIds(accessibleAccountIds);

  /* 2. Забираем все транзакции по доступным счётам
   *    (и исходящие, и входящие transfer-ы)        */
  let txs = await this.repo.findByAccountOrToAccountIds(accessibleAccountIds);

  /* 3. Базовый фильтр: не удалённые + по type (если задан) */
  txs = txs.filter(t => !t.deletedAt && (!type || t.type === type));

  /* 4. Дополнительные фильтры из query-параметров */
  /*if (accountIdsFilter.length) {
    txs = txs.filter(t => accountIdsFilter.includes(t.accountId));
  }*/
  if (accountIdsFilter.length) {
    txs = txs.filter(
      t =>
        accountIdsFilter.includes(t.accountId) ||
        (t.toAccountId && accountIdsFilter.includes(t.toAccountId)),
    );
  }

  if (userIdsFilter.length) {
    txs = txs.filter(t => userIdsFilter.includes(t.userId));
  }

  if (categoryIdsFilter.length) {
    txs = txs.filter(t => categoryIdsFilter.includes(t.categoryId));
  }

  if (dateFilter) {
    const d0 = new Date(dateFilter); d0.setUTCHours(0,0,0,0);
    txs = txs.filter(t => {
      const td = new Date(t.date); td.setUTCHours(0,0,0,0);
      return td.getTime() === d0.getTime();
    });
  }

  if (monthFilter || yearFilter) {
    txs = txs.filter(t => {
      const td = new Date(t.date);
      const m = td.getUTCMonth()+1, y = td.getUTCFullYear();
      return (monthFilter  ? m === monthFilter  : true)
          && (yearFilter   ? y === yearFilter   : true);
    });
  }

  if (fromFilter) {
    const f = new Date(fromFilter); f.setUTCHours(0,0,0,0);
    txs = txs.filter(t => new Date(t.date) >= f);
  }
  if (toFilter) {
    const tEnd = new Date(toFilter); tEnd.setUTCHours(23,59,59,999);
    txs = txs.filter(t => new Date(t.date) <= tEnd);
  }

  /* 5. Нормализуем дату (оставляем только дату без времени) */
  return txs.map(t => {
    const d = new Date(t.date);
    d.setUTCHours(0, 0, 0, 0);
    t.date = d;
    return t;
  });
}


  /** Получение транзакции по ID */
  async get(
    userId: string,
    id: string,
    peers: string[] = [],
  ): Promise<TransactionEntity> {
    const ent = await this.repo.findById(id);
    if (!ent || ent.deletedAt) {
      throw new NotFoundException('Transaction not found');
    }

    const allowed = new Set([userId, ...peers]);
    if (!allowed.has(ent.userId)) {
      throw new ForbiddenException('Access denied');
    }

    // нормализуем дату
    const d = new Date(ent.date);
    d.setUTCHours(0,0,0,0);
    ent.date = d;
    return ent;
  }

  /** Обновление транзакции */
  async update(userId: string, id: string, dto: TransactionUpdate.Request): Promise<TransactionUpdate.Response> {
    const existing = await this.repo.findById(id);
    if (!existing || existing.deletedAt) throw new NotFoundException('Transaction not found or deleted');
    if (existing.userId !== userId) throw new ForbiddenException('Access denied');
  
    // итоговые поля
    const newCategoryId = dto.categoryId ?? existing.categoryId;
    const newToAccId    = dto.toAccountId ?? existing.toAccountId;
    const newAccountId  = dto.accountId  ?? existing.accountId;
  
    // Проверяем счёт, если он изменяется
    if (dto.accountId) await this.rmq.send(AccountGet.topic, { userId, id: newAccountId });
  
    // Всегда проверяем (новую) категорию, чтобы знать её тип
    const { category } = await this.rmq.send<CategoryGet.Request, CategoryGet.Response>(
      CategoryGet.topic, { userId, id: newCategoryId },
    );
    const catType = category.type as FlowType;
  
    if (catType === FlowType.Transfer) {
      if (!newToAccId) {
        throw new BadRequestException('toAccountId required for transfer category');
      }
      if (newToAccId === newAccountId) {
        throw new BadRequestException('toAccountId must differ from accountId');
      }
      // проверяем toAccountId (если изменился)
      if (dto.toAccountId) {
        await this.rmq.send(AccountGet.topic, { userId, id: newToAccId });
      }
    } else {
      if (newToAccId) {
        throw new BadRequestException('toAccountId allowed only for transfer category');
      }
    }
  
    // нормализуем дату
    if (dto.date) {
      const d = new Date(dto.date); d.setUTCHours(0,0,0,0);
      dto.date = d as any;
    }
  
    // собираем сущность и сохраняем
    const updatedEntity = new TransactionEntity({
      ...existing,
      ...dto,
      categoryId: newCategoryId,
      toAccountId: newToAccId,
      type: catType,
    }).markUpdated();
  
    await this.repo.update(updatedEntity);
    await this.events.emit(updatedEntity.events);
    return {};
  }

  /** Мягкое удаление транзакции */
  async delete(userId: string, id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Transaction not found');
    if (existing.userId !== userId) throw new ForbiddenException('Access denied');

    const entity = existing.markDeleted();
    await this.repo.softDelete(entity);
    await this.events.emit(entity.events);
  }

  async purge(userId: string, id: string, peers: string[] = []): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Transaction not found');
    if (![userId, ...peers].includes(existing.userId)) {
      this.logger.log(peers);
      
      throw new ForbiddenException('Access denied');
    }

    // генерируем событие «удалено навсегда», если нужно
    const entity = existing.markDeleted(); // используем то же событие
    await this.repo.hardDelete(id);        // ⟵ непосредственно удаляем
    await this.events.emit(entity.events); // нотификация
  }
}
