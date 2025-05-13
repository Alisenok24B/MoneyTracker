import { IDomainEvent, ITransaction, FlowType } from '@moneytracker/interfaces';

export class TransactionEntity implements ITransaction {
  _id?: string;
  userId: string;
  accountId: string;
  toAccountId?: string; // только для transfer
  categoryId: string;
  type: FlowType;
  amount: number;
  date: Date;
  description?: string;
  deletedAt?: Date;

  // сюда накапливаются события
  events: IDomainEvent[] = [];

  constructor(data: Partial<ITransaction>) {
    Object.assign(this, data);
  }

  markCreated(): this {
    this.events.push({
      topic: 'transaction.created.event',
      data: { transactionId: this._id },
    });
    return this;
  }

  markUpdated(): this {
    this.events.push({
      topic: 'transaction.updated.event',
      data: { transactionId: this._id },
    });
    return this;
  }

  markDeleted(): this {
    this.events.push({
      topic: 'transaction.deleted.event',
      data: { transactionId: this._id },
    });
    return this;
  }
}
