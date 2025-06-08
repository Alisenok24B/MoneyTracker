import { BillingCycleType, ICreditCardDetails } from '@moneytracker/interfaces';

export class CreditDetails implements ICreditCardDetails {
  constructor(
    public creditLimit: number,
    public billingCycleType: BillingCycleType,
    public paymentPeriodDays: number = 0,
    public interestRate: number = 0,
    public gracePeriodDays?: number,
    public annualFee?: number,
    public cashWithdrawalFeePercent?: number,
    public cashWithdrawalFeeFixed?: number,
    public cashWithdrawalLimitPerMonth?: number,
    public statementAnchor?: Date
  ) {
    /* in-class валидация */
    if (billingCycleType === 'fixed' || billingCycleType === 'perPurchase') {
      if (gracePeriodDays == null) {
        throw new Error('gracePeriodDays required for fixed or perPurchase');
      }
    } else {
      if (gracePeriodDays != null) {
        throw new Error(`gracePeriodDays forbidden for calendar billingCycleType=${billingCycleType}, gracePeriodDays=${gracePeriodDays}`);
      }
    }
    if (billingCycleType === 'fixed') {
      if (statementAnchor == null) {
        throw new Error('statementAnchor required for fixed');
      }
    } else {
      if (statementAnchor != null) {
        throw new Error('statementAnchor forbidden for calendar and perPurchase');
      }
    }
  }

  /* Единственное допустимое изменение — размер лимита */
  updateLimit(limit: number) {
    this.creditLimit = limit;
  }
}