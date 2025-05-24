import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountRepository } from './repositories/account.repository';
import { AccountEntity } from './entities/account.entity';
import { AccountType, IAccount } from '@moneytracker/interfaces';
import { AccountEventEmitter } from './account.event-emitter';
import { CreditService } from '../credit-card/credit-card.service';
import { CreditPeriodService } from '../credit-card/credit-period.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly repo: AccountRepository,
    private readonly events: AccountEventEmitter,
    private readonly creditService: CreditService,
    private readonly creditPeriods: CreditPeriodService
  ) {}

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
          if (cd.statementAnchor == null) {
            throw new BadRequestException('statementAnchor required for fixed cycle');
          }
          break;
        case 'calendar':
          if (cd.billingCycleStartDayOfMonth == null) {
            throw new BadRequestException('billingCycleStartDayOfMonth required for calendar cycle');
          }
          if (cd.billingCycleLengthDays != null) {
            throw new BadRequestException('billingCycleLengthDays not allowed for calendar cycle');
          }
          if (cd.statementAnchor != null) {
            throw new BadRequestException('statementAnchor allowed only for fixed');
          }
          break;
        default: // perPurchase
          if (cd.billingCycleLengthDays != null || cd.billingCycleStartDayOfMonth != null || cd.statementAnchor != null) {
            throw new BadRequestException('No cycle-length fields allowed for perPurchase');
          }
      }
    }
    // баланс уже в dto для non-credit, для creditCard dto.balance может быть undefined → default 0
    // определяем initialBalance
    let initialBalance: number;
    if (dto.type === AccountType.CreditCard) {
      // для кредитной карты — всегда 0
      initialBalance = 0;
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
      await this.creditPeriods.initForAccount(doc._id!.toString(), new Date());
    }
    await this.events.emit(created.events);        // эмитируем события создания
    return created;
  }

  async listAccounts(userId: string, peers: string[] = []): Promise<AccountEntity[]> {
    const docs = await this.repo.findByUsers([userId, ...peers]);
    const entities = docs.map(d => new AccountEntity(d.toObject()));

    // для каждого кредитного аккаунта подгружаем детали
    return Promise.all(
      entities.map(async e => {
        if (e.type === AccountType.CreditCard) {
          e.creditDetails = await this.creditService.getDetailsByAccountId(e._id!);
        }
        return e;
      }),
    );
  }

  async getAccount(userId: string, id: string): Promise<AccountEntity> {
    const doc = await this.repo.findByIdIncludeDeleted(id);
    if (!doc) throw new NotFoundException('Account not found or deleted');
    if (doc.userId !== userId) throw new ForbiddenException('Access denied');
    const entity = new AccountEntity(doc.toObject());

    if (entity.type === AccountType.CreditCard) {
      entity.creditDetails = await this.creditService.getDetailsByAccountId(id);
    }
    return entity;
  }

  async updateAccount(userId: string, id: string, update: Partial<IAccount>): Promise<AccountEntity> {
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
    return entity;
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

    // если это кредитная карта — мягко удаляем её детали
    if (doc.type === AccountType.CreditCard) {
      await this.creditService.softDeleteByAccountId(id);
      await this.creditPeriods.initForAccount(id);
    }

    // отправляем все накопленные события (в частности, account.deleted.event)
    await this.events.emit(entity.events);
  }
}