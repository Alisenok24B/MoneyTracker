import { IAccount, AccountType, ICreditDetails, IDomainEvent } from '@moneytracker/interfaces';

export class AccountEntity implements IAccount {
  _id?: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  creditDetails?: ICreditDetails;
  events: IDomainEvent[] = [];
  deletedAt?: Date;

  constructor(data: IAccount) {
    Object.assign(this, data);
  }

  // Пример доменного метода: генерация события после создания
  markCreated() {
    this.events.push({
      topic: 'account.created.event',
      data: { accountId: this._id, userId: this.userId },
    });
    return this;
  }

  // Помечаем счёт удалённым
  markDeleted() {
    this.deletedAt = new Date();
    this.events.push({
      topic: 'account.deleted.event',
      data: { accountId: this._id },
    });
    return this;
  }

  /** Генерирует событие обновления метаданных счёта */
  markUpdated() {
    this.events.push({
      topic: 'account.updated.event',
      data: { accountId: this._id, changes: { /* можно описать, что менялось */ } },
    });
    return this;
  }

  // Дополнительные методы работы с балансом
  updateBalance(amount: number) {
    this.balance += amount;
    this.events.push({
      topic: 'account.balance.updated',
      data: { accountId: this._id, newBalance: this.balance },
    });
    return this;
  }
}
