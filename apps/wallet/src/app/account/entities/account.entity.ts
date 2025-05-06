import {
  IAccount,
  ICreditCardDetails,
  IDomainEvent,
} from '@moneytracker/interfaces';

export class AccountEntity implements IAccount {
  _id?: string;
  userId: string;
  name: string;
  type: any;
  balance: number;
  currency: string;
  creditDetails?: ICreditCardDetails;
  deletedAt?: Date;
  events: IDomainEvent[] = [];

  constructor(data: IAccount) {
    Object.assign(this, data);
  }

  markCreated() {
    this.events.push({
      topic: 'account.created.event',
      data: { accountId: this._id, userId: this.userId },
    });
    return this;
  }

  markUpdated() {
    this.events.push({
      topic: 'account.updated.event',
      data: { accountId: this._id },
    });
    return this;
  }

  markDeleted() {
    this.deletedAt = new Date();
    this.events.push({
      topic: 'account.deleted.event',
      data: { accountId: this._id },
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
