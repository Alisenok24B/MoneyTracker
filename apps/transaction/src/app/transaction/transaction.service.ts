// apps/transactions/src/app/transactions/transaction.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionEntity } from './entities/transaction.entity';
import { ITransaction } from '@moneytracker/interfaces';
import { TransactionEventEmitter } from './transaction.event-emitter';
import { AccountGet, CategoryGet } from '@moneytracker/contracts';
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
    // 1. Проверяем, что счёт существует и принадлежит пользователю
    await this.rmq.send<AccountGet.Request, AccountGet.Response>(
      AccountGet.topic,
      { userId, id: dto.accountId },
    );

    // 2. Проверяем, что категория либо дефолтная, либо принадлежит пользователю
    await this.rmq.send<CategoryGet.Request, CategoryGet.Response>(
      CategoryGet.topic,
      { userId, id: dto.categoryId },
    );

    // 3. Нормализуем дату: оставляем только дату без времени
    const dateOnly = new Date(dto.date);
    dateOnly.setHours(0, 0, 0, 0);

    // 4. Собираем сущность и генерируем событие
    const entity = new TransactionEntity({ ...dto, userId, date: dateOnly }).markCreated();

    // 5. Сохраняем через репозиторий
    const saved = await this.repo.create(entity);

    // 6. Подтягиваем сгенерированный _id, createdAt, updatedAt
    entity._id = saved._id;

    // 7. Эмитим доменные события
    await this.events.emit(entity.events);

    return entity;
  }


  /** Список транзакций по счётам */
  async list(userId: string, accountIds: string[]): Promise<TransactionEntity[]> {
    const all = await this.repo.findByAccountIds(accountIds);
    return all
      .filter(e => e.deletedAt == null)          // только не удалённые
      .map(e => {
        // обрезаем время
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
    dto: Partial<Omit<ITransaction, '_id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>,
  ): Promise<TransactionEntity> {
    // 1) Убедиться, что транзакция существует и не удалена
    const existing = await this.repo.findById(id);
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Transaction not found or already deleted');
    }
    // 2) Проверить права на счёт
    await this.rmq.send(AccountGet.topic, { userId, id: existing.accountId });
    // 3) Проверить права на категорию
    await this.rmq.send(CategoryGet.topic, { userId, id: dto.categoryId ?? existing.categoryId });

    // 4) Нормализовать дату, если передали
    if (dto.date) {
      const d = new Date(dto.date);
      d.setHours(0,0,0,0);
      dto.date = d as any;
    }

    // 5) Собрать новую сущность, сгенерировать событие
    const updatedEntity = new TransactionEntity({ ...existing, ...dto }).markUpdated();

    // 6) Сохранить
    const saved = await this.repo.update(updatedEntity);
    return updatedEntity;
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
