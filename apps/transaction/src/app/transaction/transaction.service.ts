// apps/transactions/src/app/transactions/transaction.service.ts
import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionEntity } from './entities/transaction.entity';
import { ITransaction, FlowType } from '@moneytracker/interfaces';
import { TransactionEventEmitter } from './transaction.event-emitter';
import { AccountGet, AccountList, CategoryGet, TransactionCreate, TransactionUpdate } from '@moneytracker/contracts';
import { RMQService } from 'nestjs-rmq';

@Injectable()
export class TransactionService {
  constructor(
    private readonly repo: TransactionRepository,
    private readonly events: TransactionEventEmitter,
    private readonly rmq: RMQService
  ) {}

  /** Создание транзакции */
  async create(userId: string, dto: TransactionCreate.Request): Promise<TransactionCreate.Response> {
    // 1. Проверяем счёт
    await this.rmq.send(AccountGet.topic, { userId, id: dto.accountId });
  
    // 2. Получаем категорию и её тип
    const { category } = await this.rmq.send<CategoryGet.Request, CategoryGet.Response>(
      CategoryGet.topic, { userId, id: dto.categoryId },
    );
    const catType = category.type as FlowType;   // income | expense | transfer
  
    // 3. Валидации transfer-категории
    if (catType === FlowType.Transfer) {
      if (!dto.toAccountId) {
        throw new BadRequestException('toAccountId required for transfer category');
      }
      if (dto.toAccountId === dto.accountId) {
        throw new BadRequestException('toAccountId must differ from accountId');
      }
      // проверяем целевой счёт
      await this.rmq.send(AccountGet.topic, { userId, id: dto.toAccountId });
    } else {
      // non-transfer: toAccountId недопустим
      if (dto.toAccountId) {
        throw new BadRequestException('toAccountId allowed only for transfer category');
      }
      // проверяем категорию
      await this.rmq.send(CategoryGet.topic, { userId, id: dto.categoryId });
    }

    //проверяем счет списания
    await this.rmq.send(AccountGet.topic, { userId, id: dto.accountId });
  
    // 4. Нормализуем дату
    const dateOnly = new Date(dto.date); dateOnly.setHours(0,0,0,0);
  
    // 5. Собираем сущность
    const entity = new TransactionEntity({
      ...dto,
      userId,
      type: catType,
      date: dateOnly,
    }).markCreated();
  
    const saved = await this.repo.create(entity);
    entity._id = saved._id;
    await this.events.emit(entity.events);
    return {};
  }



  /** Список транзакций по счётам */
  async list(
    userId: string,
    peers: string[] = [],
    type?: FlowType,
  ): Promise<TransactionEntity[]> {
    // 1) Запросить все счета (ваши + peers) у Wallet-микросервиса
    const { accounts } = await this.rmq.send<
      AccountList.Request,
      AccountList.Response
    >(AccountList.topic, { userId, peers });

    const accountIds = accounts.map(a => a._id);

    // 2) Забрать все транзакции по этим счетам
    const all = await this.repo.findByAccountIds(accountIds);

    // 3) Отфильтровать только не удалённые и по типу
    const filtered = all.filter(e => e.deletedAt == null && (!type || e.type === type));

    // 4) Обрезать время в date
    return filtered.map(e => {
      const d = new Date(e.date);
      d.setHours(0,0,0,0);
      e.date = d;
      return e;
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
    d.setHours(0,0,0,0);
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
      const d = new Date(dto.date); d.setHours(0,0,0,0);
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

  async purge(userId: string, id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Transaction not found');
    if (existing.userId !== userId)
      throw new ForbiddenException('Access denied');

    // генерируем событие «удалено навсегда», если нужно
    const entity = existing.markDeleted(); // используем то же событие
    await this.repo.hardDelete(id);        // ⟵ непосредственно удаляем
    await this.events.emit(entity.events); // нотификация
  }
}
