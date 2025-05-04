import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountRepository } from './repositories/account.repository';
import { AccountEntity } from './entities/account.entity';
import { IAccount } from '@moneytracker/interfaces';
import { AccountEventEmitter } from './account.event-emitter';

@Injectable()
export class AccountService {
  constructor(private readonly repo: AccountRepository, private readonly events: AccountEventEmitter) {}

  async createAccount(dto: Omit<IAccount, '_id' | 'balance'>): Promise<AccountEntity> {
    const entity = new AccountEntity({ ...dto, balance: 0 });
    entity.markCreated();                          // уже был
    const doc = await this.repo.create(entity);
    const created = new AccountEntity(doc.toObject());
    await this.events.emit(created.events);        // ← эмитируем события создания
    return created;
  }

  async listAccounts(userId: string, peers: string[] = []): Promise<AccountEntity[]> {
    const docs = await this.repo.findByUsers([userId, ...peers]);
    return docs.map(d => new AccountEntity(d.toObject()));
  }

  async getAccount(userId: string, id: string): Promise<AccountEntity> {
    const doc = await this.repo.findById(id);
    if (!doc) throw new NotFoundException('Account not found or deleted');
    if (doc.userId !== userId) throw new ForbiddenException('Access denied');
    return new AccountEntity(doc.toObject());
  }

  async updateAccount(userId: string, id: string, update: Partial<IAccount>): Promise<AccountEntity> {
    const doc = await this.repo.findById(id);
    if (!doc) throw new NotFoundException('Account not found or deleted');
    if (doc.userId !== userId) throw new ForbiddenException('Access denied');

    const entity = new AccountEntity(doc.toObject());
    entity.markUpdated();                          // ← генерируем событие обновления
    Object.assign(entity, update);
    await this.repo.update(id, update);

    const updated = new AccountEntity({ ...entity, _id: id });
    await this.events.emit(updated.events);        // ← эмитируем события обновления
    return updated;
  }

  async deleteAccount(userId: string, id: string): Promise<void> {
    // находим лишь НЕ удалённый документ
    const doc = await this.repo.findById(id);
    if (!doc) throw new NotFoundException('Account not found or already deleted');
    if (doc.userId !== userId) throw new ForbiddenException('Access denied');

    // превращаем в доменную сущность и помечаем удалённым
    const entity = new AccountEntity(doc.toObject()).markDeleted();

    // сохраняем метку deletedAt
    await this.repo.softDelete(id, entity.deletedAt);

    // отправляем все накопленные события (в частности, account.deleted.event)
    await this.events.emit(entity.events);
  }
}