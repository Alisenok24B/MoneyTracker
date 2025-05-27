import { IDomainEvent, ITransaction, FlowType } from '@moneytracker/interfaces';

export class TransactionEntity implements ITransaction {
  _id?: string;
  userId: string;
  accountId: string;
  toAccountId?: string; // только для transfer
  periodId?: string; // только для кредитных карт при accountId + income и toAccountId + transfer
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
      data: {
        _id:          this._id,
        userId:       this.userId,
        accountId:    this.accountId,
        toAccountId:  this.toAccountId,
        periodId:  this.periodId,
        categoryId:   this.categoryId,
        type:         this.type,
        amount:       this.amount,
        date:         this.date,
        description:  this.description,
      },
    });
    return this;
  }

  markUpdated(): this {
    this.events.push({
      topic: 'transaction.updated.event',
      data: {
        _id:          this._id,
        userId:       this.userId,
        accountId:    this.accountId,
        toAccountId:  this.toAccountId,
        periodId:  this.periodId,
        categoryId:   this.categoryId,
        type:         this.type,
        amount:       this.amount,
        date:         this.date,
        description:  this.description,
      },
    });
    return this;
  }

  markDeleted(): this {
    this.events.push({
      topic: 'transaction.deleted.event',
      data: { _id: this._id },
    });
    return this;
  }
}
