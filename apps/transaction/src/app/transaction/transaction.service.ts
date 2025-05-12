// apps/transactions/src/app/transactions/transaction.service.ts
import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionEntity } from './entities/transaction.entity';
import { ITransaction, TransactionType } from '@moneytracker/interfaces';
import { TransactionEventEmitter } from './transaction.event-emitter';
import { AccountGet, AccountList, CategoryGet } from '@moneytracker/contracts';
import { RMQService } from 'nestjs-rmq';

@Injectable()
export class TransactionService {
  constructor(
    private readonly repo: TransactionRepository,
    private readonly events: TransactionEventEmitter,
    private readonly rmq: RMQService
  ) {}

  /** Создание транзакции */
  async create(
    userId: string,
    dto: Omit<ITransaction, '_id' | 'deletedAt'>,
  ): Promise<TransactionEntity> {
    // --- общие валидации ---
    if (dto.type === 'transfer') {
      // 1) Обязательно toAccountId, и оно не должно совпадать с accountId
      if (!dto.toAccountId) {
        throw new BadRequestException('toAccountId required for transfer');
      }
      if (dto.toAccountId === dto.accountId) {
        throw new BadRequestException('toAccountId must differ from accountId');
      }
      // 2) Категория при переводе недопустима
      if (dto.categoryId) {
        throw new BadRequestException('categoryId must not be provided for transfer');
      }
      // 3) Проверяем оба счета
      await this.rmq.send(AccountGet.topic, { userId, id: dto.accountId });
      await this.rmq.send(AccountGet.topic, { userId, id: dto.toAccountId });
      // По договорённости присваиваем фиктивную категорию
      dto.categoryId = 'transfer';
    } else {
      // income/expense
      // 1) accountId + categoryId обязательны
      if (!dto.categoryId) {
        throw new BadRequestException('categoryId required for income/expense');
      }
      // 2) Проверяем счёт и категорию
      await this.rmq.send(AccountGet.topic, { userId, id: dto.accountId });
      await this.rmq.send(CategoryGet.topic, { userId, id: dto.categoryId });
      // 3) toAccountId недопустима
      if (dto.toAccountId) {
        throw new BadRequestException('toAccountId must not be provided for income/expense');
      }
    }

    // Нормализуем дату (без времени)
    const d = new Date(dto.date);
    d.setHours(0, 0, 0, 0);

    // Собираем сущность и сохраняем
    const entity = new TransactionEntity({ ...dto, userId, date: d }).markCreated();
    const saved = await this.repo.create(entity);

    // Подставляем сгенерированные поля
    entity._id = saved._id;

    await this.events.emit(entity.events);
    return entity;
  }



  /** Список транзакций по счётам */
  async list(
    userId: string,
    peers: string[] = [],
    type?: TransactionType,
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
  async update(
    userId: string,
    id: string,
    dto: Partial<Omit<ITransaction, '_id' | 'deletedAt'>>,
  ): Promise<TransactionEntity> {
    const existing = await this.repo.findById(id);
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Transaction not found or deleted');
    }
    if (existing.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Определяем новые значения полей для проверки
    const newType = dto.type ?? existing.type;
    const newAccountId = dto.accountId ?? existing.accountId;
    const newToAccountId = dto.toAccountId ?? existing.toAccountId;
    const newCategoryId = dto.categoryId ?? existing.categoryId;

    if (newType === 'transfer') {
      // Обязательно два разных счёта
      if (!newToAccountId) {
        throw new BadRequestException('toAccountId required for transfer');
      }
      if (newAccountId === newToAccountId) {
        throw new BadRequestException('toAccountId must differ from accountId');
      }
      // Недопустима категория
      if (dto.categoryId) {
        throw new BadRequestException('categoryId must not be provided for transfer');
      }
      // Проверяем счёта, если они менялись
      if (dto.accountId) {
        await this.rmq.send(AccountGet.topic, { userId, id: newAccountId });
      }
      if (dto.toAccountId) {
        await this.rmq.send(AccountGet.topic, { userId, id: newToAccountId! });
      }
      // Устанавливаем дефолтную категорию
      dto.categoryId = 'transfer';
    } else {
      // income/expense
      // Если тип не transfer, обязателен categoryId
      if (!newCategoryId) {
        throw new BadRequestException('categoryId required for income/expense');
      }
      // Недопустим toAccountId
      if (dto.toAccountId) {
        throw new BadRequestException('toAccountId must not be provided for income/expense');
      }
      // Проверяем счёт и категорию при изменении
      if (dto.accountId) {
        await this.rmq.send(AccountGet.topic, { userId, id: newAccountId });
      }
      if (dto.categoryId) {
        await this.rmq.send(CategoryGet.topic, { userId, id: newCategoryId! });
      }
    }

    // Нормализуем дату, если её передавали
    if (dto.date) {
      const dd = new Date(dto.date);
      dd.setHours(0, 0, 0, 0);
      dto.date = dd as any;
    }

    // Собираем и сохраняем
    const updated = new TransactionEntity({ ...existing, ...dto }).markUpdated();
    const saved = await this.repo.update(updated);

    await this.events.emit(updated.events);
    return updated;
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
}
