import { BillingCycleType, ICreditCardDetails } from '@moneytracker/interfaces';

export class CreditDetails implements ICreditCardDetails {
  constructor(
    public creditLimit: number,
    public gracePeriodDays: number,
    public billingCycleType: BillingCycleType,
    public billingCycleLengthDays?: number,
    public billingCycleStartDayOfMonth?: number,
    public paymentPeriodDays: number = 0,
    public interestRate: number = 0,
    public annualFee?: number,
    public cashWithdrawalFeePercent?: number,
    public cashWithdrawalFeeFixed?: number,
    public cashWithdrawalLimitPerMonth?: number,
    public statementAnchor?: Date
  ) {
    /* in-class валидация */
    if (billingCycleType === 'fixed'     && billingCycleLengthDays == null)
      throw new Error('billingCycleLengthDays required for fixed');
    if (billingCycleType === 'calendar'  && billingCycleStartDayOfMonth == null)
      throw new Error('billingCycleStartDayOfMonth required for calendar');
    if (billingCycleType !== 'fixed'     && billingCycleLengthDays != null)
      throw new Error('billingCycleLengthDays forbidden for non-fixed');
    if (billingCycleType !== 'calendar'  && billingCycleStartDayOfMonth != null)
      throw new Error('billingCycleStartDayOfMonth forbidden for non-calendar');
  }

  /* Единственное допустимое изменение — размер лимита */
  updateLimit(limit: number) {
    this.creditLimit = limit;
  }
}