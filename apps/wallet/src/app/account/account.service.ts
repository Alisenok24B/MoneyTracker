import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountRepository } from './repositories/account.repository';
import { AccountEntity } from './entities/account.entity';
import { AccountType, IAccount } from '@moneytracker/interfaces';
import { AccountEventEmitter } from './account.event-emitter';

@Injectable()
export class AccountService {
  constructor(private readonly repo: AccountRepository, private readonly events: AccountEventEmitter) {}

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
          if (cd.billingCycleLengthDays == null) {
            throw new BadRequestException('billingCycleLengthDays required for fixed cycle');
          }
          if (cd.billingCycleStartDayOfMonth != null) {
            throw new BadRequestException('billingCycleStartDayOfMonth not allowed for fixed cycle');
          }
          break;
        case 'calendar':
          if (cd.billingCycleStartDayOfMonth == null) {
            throw new BadRequestException('billingCycleStartDayOfMonth required for calendar cycle');
          }
          if (cd.billingCycleLengthDays != null) {
            throw new BadRequestException('billingCycleLengthDays not allowed for calendar cycle');
          }
          break;
        default: // perPurchase
          if (cd.billingCycleLengthDays != null || cd.billingCycleStartDayOfMonth != null) {
            throw new BadRequestException('No cycle-length fields allowed for perPurchase');
          }
      }
    }
    // баланс уже в dto для non-credit, для creditCard dto.balance может быть undefined → default 0
    // определяем initialBalance
    let initialBalance: number;
    if (dto.type === AccountType.CreditCard) {
      // для кредитной карты — всегда её лимит, игнорируем dto.balance
      initialBalance = 0;
    } else {
      // для остальных — balance из dto (в Controller мы уже гарантировали, что оно задано)
      initialBalance = dto.balance!;
    }
    const entity = new AccountEntity({ ...dto, balance: initialBalance });
    entity.markCreated();
    const doc = await this.repo.create(entity);
    const created = new AccountEntity(doc.toObject());
    await this.events.emit(created.events);        // эмитируем события создания
    return created;
  }

  async listAccounts(userId: string, peers: string[] = []): Promise<AccountEntity[]> {
    const docs = await this.repo.findByUsers([userId, ...peers]);
    return docs.map(d => new AccountEntity(d.toObject()));
  }

  async getAccount(userId: string, id: string): Promise<AccountEntity> {
    const doc = await this.repo.findByIdIncludeDeleted(id);
    if (!doc) throw new NotFoundException('Account not found or deleted');
    if (doc.userId !== userId) throw new ForbiddenException('Access denied');
    return new AccountEntity(doc.toObject());
  }

  async updateAccount(userId: string, id: string, update: Partial<IAccount>): Promise<AccountEntity> {
    const doc = await this.repo.findById(id);
    if (!doc) throw new NotFoundException('Account not found or deleted');
    if (doc.userId !== userId) throw new ForbiddenException('Access denied');
    // Для не CreditCard–счетов creditDetails запрещены
    if (update.creditDetails && doc.type !== AccountType.CreditCard) {
      throw new BadRequestException('creditDetails can only be updated for CreditCard accounts');
    }
    
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