import { IDomainEvent } from '@moneytracker/interfaces';

export type PeriodStatus = 'open' | 'payment' | 'overdue' | 'closed';
export type FlowType     = 'income' | 'expense';

export interface ICreditPeriod {
  _id?: string;
  accountId: string;

  /** начало расчётного под-периода  */
  statementStart: Date;
  /** конец расчётного под-периода  */
  statementEnd: Date;
  /** крайний день оплаты  */
  paymentDue: Date;

  status: PeriodStatus;

  /** сколько потратили внутри statement-окна  */
  totalSpent: number;
  /** сколько уже погашено  */
  paidAmount: number;
  /** начисленные проценты (копятся ежедневно после paymentDue) */
  interestAccrued: number;
  interestRate: number;
  /** флаг: начали начислять проценты */
  hasInterest: boolean;

  /** soft-delete */
  deletedAt?: Date;
}

export class CreditPeriodEntity implements ICreditPeriod {
  _id?: string;
  accountId: string;
  statementStart: Date;
  statementEnd: Date;
  paymentDue: Date;
  status: PeriodStatus;
  totalSpent: number;
  paidAmount: number;
  interestAccrued: number;
  interestRate: number;
  hasInterest: boolean;
  deletedAt?: Date;

  /** доменные события  */
  events: IDomainEvent[] = [];

  constructor(data?: Partial<ICreditPeriod>) {
    if (data) Object.assign(this, data);
    this.hasInterest = data?.hasInterest ?? false;
  }

  markCreated() {
    this.events.push({
      topic: 'credit.period.created',
      data: { accountId: this.accountId, periodId: this._id },
    });
    return this;
  }

  markUpdated() {
    this.events.push({
      topic: 'credit.period.updated',
      data: { periodId: this._id },
    });
    return this;
  }

  markDeleted() {
    this.deletedAt = new Date();
    this.events.push({
      topic: 'credit.period.deleted',
      data: { periodId: this._id },
    });
    return this;
  }

  /** зачесть списание (покупка) */
  addExpense(amount: number) {
    this.totalSpent += amount;
    return this;
  }

  /** зачесть платеж (до или после due-даты) */
  addPayment(amount: number) {
    this.paidAmount += amount;
    return this;
  }

  /** ежедневно после paymentDue начисляем проценты */
  accrue(interestForDay: number) {
    this.interestAccrued += interestForDay;
    return this;
  }
}