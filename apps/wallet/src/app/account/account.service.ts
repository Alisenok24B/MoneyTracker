import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AccountRepository } from './repositories/account.repository';
import { AccountEntity } from './entities/account.entity';
import { AccountType, BalanceHistoryEntry, IAccount, PaymentInfo } from '@moneytracker/interfaces';
import { AccountEventEmitter } from './account.event-emitter';
import { CreditService } from '../credit-card/credit-card.service';
import { CreditPeriodService } from '../credit-card/credit-period.service';
import { RMQService } from 'nestjs-rmq';
import { TransactionList } from '@moneytracker/contracts';

@Injectable()
export class AccountService {
  constructor(
    private readonly repo: AccountRepository,
    private readonly events: AccountEventEmitter,
    private readonly creditService: CreditService,
    private readonly creditPeriods: CreditPeriodService,
    private readonly rmq: RMQService,
  ) {}
  private readonly logger = new Logger(AccountService.name);

  /**
   * Считает текущий баланс для «обычного» (не-кредитного) счёта:
   *   current = initialBalance 
   *           + Σ(income)
   *           − Σ(expense)
   *           + Σ(transfers_in)
   *           − Σ(transfers_out)
   */
  private async calculateNonCreditCurrentBalance(
    userId: string,
    peers: string[],
    accountId: string,
    initialBalance: number,
  ): Promise<number> {
    // Запрашиваем у Transaction-микросервиса все транзакции, в которых фигурирует данный accountId
    const { transactions } = await this.rmq.send<
      TransactionList.Request,
      TransactionList.Response
    >(TransactionList.topic, {
      userId,
      peers,
      accountIds: [accountId],
      // остальные фильтры не нужны: берём всё
    });

    let delta = 0;
    for (const tx of transactions) {
      switch (tx.type) {
        case 'income':
          if (tx.accountId === accountId) {
            delta += tx.amount;
          }
          break;
        case 'expense':
          if (tx.accountId === accountId) {
            delta -= tx.amount;
          }
          break;
        case 'transfer':
          // если этот счёт – «отправитель» (accountId), то вычитаем
          if (tx.accountId === accountId) {
            delta -= tx.amount;
          }
          // если этот счёт – «получатель» (toAccountId), то добавляем
          if (tx.toAccountId === accountId) {
            delta += tx.amount;
          }
          break;
        default:
          // ничего
          break;
      }
    }

    return initialBalance + delta;
  }

  async createAccount(dto: Omit<IAccount, '_id' | 'deletedAt'>): Promise<AccountEntity> {
    // Если пытаются задать creditDetails для любого типа кроме CreditCard — запрещаем
    if (dto.creditDetails && dto.type !== AccountType.CreditCard) {
      throw new BadRequestException('creditDetails can only be updated for CreditCard accounts');
    }
    if (dto.type === AccountType.CreditCard && !dto.creditDetails) {
      throw new BadRequestException('For creditCard must to write creditDetails');
    }
    if (dto.creditDetails) {
      const cd = dto.creditDetails;
      switch (cd.billingCycleType) {
        case 'fixed':
          if (cd.gracePeriodDays == null) {
            throw new BadRequestException('gracePeriodDays required for fixed');
          }
          if (cd.statementAnchor == null) {
            throw new BadRequestException('statementAnchor required for fixed');
          }
          break;
        case 'calendar':
          if (cd.gracePeriodDays != null) {
            throw new BadRequestException('gracePeriodDays allowed only for fixed and perPurchase');
          }
          if (cd.statementAnchor != null) {
            throw new BadRequestException('statementAnchor allowed only for fixed');
          }
          break;
        default: // perPurchase
          if (cd.gracePeriodDays == null) {
            throw new BadRequestException('gracePeriodDays required for perPurchase');
          }
          if (cd.statementAnchor != null) {
            throw new BadRequestException('No statementAnchor allowed for perPurchase');
          }
      }
    }
    // баланс уже в dto для non-credit, для creditCard dto.balance может быть undefined → default 0
    // определяем initialBalance
    let initialBalance: number;
    if (dto.type === AccountType.CreditCard) {
      // для кредитной карты — всегда 0
      initialBalance = dto.creditDetails.creditLimit;
    } else {
      // для остальных — balance из dto (в Controller мы уже гарантировали, что оно задано)
      initialBalance = dto.balance!;
    }
    const entity = new AccountEntity({ ...dto, balance: initialBalance });
    entity.markCreated();
    const doc = await this.repo.create(entity);
    const created = new AccountEntity(doc.toObject());
    // если кредитка — сохраняем детали
    if (dto.type === AccountType.CreditCard) {
      await this.creditService.createForAccount(created._id!, dto.creditDetails!);
      if (dto.creditDetails.billingCycleType === 'fixed') {
        const msPerDay = 24 * 60 * 60 * 1000;
        // сколько дней нужно отнять:
        const daysDelta = (dto.creditDetails.gracePeriodDays! - dto.creditDetails.paymentPeriodDays);
        // текущее время в мс
        const anchorMs = new Date(dto.creditDetails.statementAnchor!).getTime()
                      - daysDelta * msPerDay;
        const anchor = new Date(anchorMs);
        await this.creditPeriods.initForAccount(doc._id!.toString(), anchor);
      } else {
        await this.creditPeriods.initForAccount(doc._id!.toString(), new Date());
      }
    }
    await this.events.emit(created.events);        // эмитируем события создания
    const userIds = [dto.userId, ...(dto.peers ?? [])];
    await this.rmq.notify('sync.peer.event', {
      userIds,
      type: 'account',
      action: 'create',
      data: {},
    });
    return created;
  }

  async listAccounts(userId: string, peers: string[] = [], lite = false): Promise<AccountEntity[]> {
    this.logger.log(`peers from accountList=${peers}`);
    const docs = await this.repo.findByUsers([userId, ...peers]);
    const entities = docs.map(d => new AccountEntity(d.toObject()));

    // если lite = true — сразу отдаём, ничего не считаем
    if (lite) return entities;

    // для каждого кредитного аккаунта подгружаем детали
    return Promise.all(
      entities.map(async e => {
        if (e.type === AccountType.CreditCard) {
          const debt = await this.creditPeriods.getAvailableCredit(e._id!.toString());
          e.balance = debt;
          e.creditDetails = await this.creditService.getDetailsByAccountId(e._id!);
        } else {
          // 2.б) Обычный: «initialBalance» в e.balance, нужно скорректировать
          const current = await this.calculateNonCreditCurrentBalance(
            userId,
            peers,
            e._id!.toString(),
            e.balance,
          );
          e.balance = current;
        }
        return e;
      }),
    );
  }

  async getAccount(userId: string, id: string, peers: string[] = []): Promise<AccountEntity> {
    const doc = await this.repo.findByIdIncludeDeleted(id);
    if (!doc) throw new NotFoundException('Account not found or deleted');
    if (![userId, ...peers].includes(doc.userId)) throw new ForbiddenException('Access denied');
    const entity = new AccountEntity(doc.toObject());

    if (entity.type === AccountType.CreditCard) {
      // Для кредитной карты balance = долг
      const debt = await this.creditPeriods.getAvailableCredit(id);
      entity.balance = debt;
      entity.creditDetails = await this.creditService.getDetailsByAccountId(id);
    } else {
      // Для остальных – «текущий баланс» на основе initial + транзакций
      const current = await this.calculateNonCreditCurrentBalance(
        userId,
        peers,
        id,
        entity.balance, 
      );
      entity.balance = current;
    }
    return entity;
  }

  async updateAccount(userId: string, id: string, peers: string[], update: Partial<IAccount>): Promise<AccountEntity> {
    const doc = await this.repo.findById(id);
    if (!doc) throw new NotFoundException('Account not found or deleted');
    if (doc.userId !== userId) throw new ForbiddenException('Access denied');
    // Для не CreditCard–счетов creditDetails запрещены
    if (update.creditDetails && doc.type !== AccountType.CreditCard) {
      throw new BadRequestException('creditDetails can only be updated for CreditCard accounts');
    }
    // изменяем название счета
    if (update.name !== undefined) {
      await this.repo.update(id, { name: update.name });
    }

    // кредитный лимит
    if (update.creditDetails?.creditLimit !== undefined) {
      await this.creditService.updateCreditLimit(id, update.creditDetails.creditLimit);
    }
    
    const entity = new AccountEntity(doc.toObject());
    entity.markUpdated();                          // ← генерируем событие обновления
    await this.events.emit(entity.events);        // ← эмитируем события обновления
    const userIds = [userId, ...(peers ?? [])];
    await this.rmq.notify('sync.peer.event', {
      userIds,
      type: 'account',
      action: 'update',
      data: {},
    });
    return entity;
  }

  async deleteAccount(userId: string, id: string, peers: string[]): Promise<void> {
    // находим лишь НЕ удалённый документ
    const doc = await this.repo.findById(id);
    if (!doc) throw new NotFoundException('Account not found or already deleted');
    if (doc.userId !== userId) throw new ForbiddenException('Access denied');

    // превращаем в доменную сущность и помечаем удалённым
    const entity = new AccountEntity(doc.toObject()).markDeleted();

    // сохраняем метку deletedAt
    await this.repo.softDelete(id, entity.deletedAt);

    // если это кредитная карта — мягко удаляем её детали
    if (doc.type === AccountType.CreditCard) {
      await this.creditService.softDeleteByAccountId(id);
      await this.creditPeriods.initForAccount(id);
    }

    // отправляем все накопленные события (в частности, account.deleted.event)
    await this.events.emit(entity.events);
    const userIds = [userId, ...(peers ?? [])];
    await this.rmq.notify('sync.peer.event', {
      userIds,
      type: 'account',
      action: 'delete',
      data: {},
    });
  }

  /**
   * Сбор “ближайших платежей” по всем кредитным картам пользователя и peer-ов
   */
  async getUpcomingPayments(userId: string, peers: string[]): Promise<PaymentInfo[]> {
    // 1. Забираем все свои и peer-овые аккаунты
    const all = await this.repo.findByUsers([userId, ...peers]);
    // 2. Фильтруем только creditCard
    const cards = all.filter(a => a.type === AccountType.CreditCard);

    const result: PaymentInfo[] = [];
    for (const c of cards) {
      // 3. Спрашиваем периоды с долгами
      const debts = await this.creditPeriods.listOutstandingDebts(c._id.toString()!);
      for (const d of debts) {
        result.push({
          accountId:     c._id.toString()!,
          accountName:   c.name,
          accountType:   c.type,
          periodId:      d.periodId,
          status:        d.status as any,
          paymentDue:    d.paymentDue,
          debt:          d.debt,
        });
      }
    }
    // 4. Сортируем по дате ближайшего платежа
    return result.sort((a, b) => a.paymentDue.localeCompare(b.paymentDue));
  }

  /**
   * История балансов по дате
   */
  async getBalanceHistory(
    userId: string,
    peers: string[],
    accountIds?: string[],
    dates?: Date[],
  ): Promise<BalanceHistoryEntry[]> {
    // 1) свои + peers
    this.logger.log(peers);
    const docs = await this.repo.findByUsers([userId, ...peers]);
    //const all = docs.map(d => d.toObject());
    //const allowedIds = all.map(a => a._id!.toString());
    const allAccounts = docs.map(d => new AccountEntity(d.toObject()));
    // 2) фильтр по accountIds
    /*const ids = accountIds && accountIds.length
      ? accountIds.filter(id => {
          if (!allowedIds.includes(id)) {
            throw new ForbiddenException(`Access denied to account ${id}`);
          }
          return true;
        })
      : allowedIds;*/
      let ids: string[];
      if (!accountIds || accountIds.length === 0) {
        ids = allAccounts
          .filter(a => a.type !== AccountType.CreditCard)
          .map(a => a._id!.toString());
      } else {
        // Иначе проверяем доступ и используем ровно тот список, что пришёл
        const allowed = new Set(allAccounts.map(a => a._id!.toString()));
        this.logger.log(`allowed = ${[...allowed]}`)
        for (const id of accountIds) {
          this.logger.log(id);
          if (!allowed.has(id)) {
            throw new ForbiddenException(`No access to account ${id}`);
          }
        }
        ids = accountIds;
      }
    // 3) составляем список дат
    let dayList: Date[];
    if (dates && dates.length) {
      // если ровно две даты — берем весь диапазон
      const start = new Date(dates[0]); start.setUTCHours(0,0,0,0);
      const end   = new Date(dates[1]); end.setUTCHours(0,0,0,0);
      if (end < start) throw new BadRequestException('End date must be ≥ start date');
      dayList = [];
      for (let cur = new Date(start); cur.getTime() <= end.getTime(); cur.setUTCDate(cur.getUTCDate()+1)) {
        dayList.push(new Date(cur));
      }
    } else {
      // дефолт: с 1-го числа текущего месяца до сегодня
      const today = new Date(); today.setUTCHours(0,0,0,0);
      const first = new Date(today); first.setUTCDate(1);
      dayList = [];
      for (let cur = new Date(first); cur.getTime() <= today.getTime(); cur.setUTCDate(cur.getUTCDate()+1)) {
        dayList.push(new Date(cur));
      }
    }
    const result: BalanceHistoryEntry[] = [];

    const allowedAccounts = allAccounts.filter(a => ids.includes(a._id!.toString()));
    this.logger.log(`allowedAccounts = ${allowedAccounts}`);
    this.logger.log(ids);
    // 5) на каждую дату считаем баланс всех счетов
    for (const date of dayList) {
      this.logger.log(date);
      // 1) Получаем все транзакции по нужным счетам до date включительно
      const { transactions } = await this.rmq.send<
        TransactionList.Request,
        TransactionList.Response
      >(TransactionList.topic, {
        userId,
        peers,
        accountIds: ids,
        to: date,
      });
      let totalForDate = 0;
  
      // 2) Для каждого счёта считаем delta
      for (const acc of allowedAccounts) {
        const aid = acc._id!.toString();
        
        this.logger.log(aid)
        // Ищем все tx, где этот счёт задействован:
        // - income/expense через accountId
        // - transfer via accountId (out) и toAccountId (in)
        const relevant = transactions.filter(tx =>
          tx.accountId === aid || tx.toAccountId === aid
        );

        // Считаем дельту
        const delta = relevant.reduce((sum, tx) => {
          if (tx.type === 'income' && tx.accountId === aid) {
            return sum + tx.amount;
          }
          if (tx.type === 'expense' && tx.accountId === aid) {
            return sum - tx.amount;
          }
          if (tx.type === 'transfer') {
            if (tx.accountId === aid)    return sum - tx.amount; // out
            if (tx.toAccountId === aid)  return sum + tx.amount; // in
          }
          return sum;
        }, 0);

        // 3) «initialBalance» из модели — это баланс на момент создания счёта
        totalForDate += acc.balance + delta;
        this.logger.log(`accountId = ${aid}, balance = ${acc.balance}, delta = ${delta}`)
      }
  
      result.push({
        date: date.toISOString().slice(0, 10),
        total: totalForDate,
      });
    }
    this.logger.log('finish');
    return result;
  }
}