export enum AccountType {
  Savings = 'savings',
  Debit = 'debit',
  CreditCard = 'creditCard',
  Cash = 'cash',
}

// Типы расчётного периода
export type BillingCycleType =
  | 'fixed'       // фиксированный цикл N дней от даты выписки
  | 'calendar'    // календарный месяц
  | 'perPurchase' // индивидуальный период от даты покупки

// Детали кредитной карты / кредитного счёта
export interface ICreditCardDetails {
  // лимит
  creditLimit: number;

  // если fixed или perPurchase:
  // льготный период (беспроцентный)
  gracePeriodDays?: number;

  // тип расчётного периода
  billingCycleType: BillingCycleType;
  // если fixed:
  statementAnchor?: Date; // дата выписки (указывается ближайшая при создании кредитной карты)

  // платёжный период
  paymentPeriodDays: number;

  // процентная ставка (годовых)
  interestRate: number;

  // годовая комиссия
  annualFee?: number;

  // комиссия за снятие наличных
  cashWithdrawalFeePercent?: number;
  cashWithdrawalFeeFixed?: number;
  cashWithdrawalLimitPerMonth?: number;
}

// Общий интерфейс для сущности «Счёт»
export interface IAccount {
  _id?: string;
  userId: string;         // чей это счёт
  name: string;           // произвольное название
  type: AccountType;
  balance: number;
  currency: string;
  creditDetails?: ICreditCardDetails;  // только для type = 'credit'
  deletedAt?: Date;        // soft-delete
}
