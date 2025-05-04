export enum AccountType {
  Savings = 'savings',
  Debit = 'debit',
  CreditCard = 'creditCard',
}

// Детали кредитной карты / кредитного счёта
export interface ICreditDetails {
  creditLimit: number;
  billingCycleStart: number;        // день месяца
  nextBillingCycleDate: string;     // ISO-строка
}

// Общий интерфейс для сущности «Счёт»
export interface IAccount {
  _id?: string;
  userId: string;         // чей это счёт
  name: string;           // произвольное название
  type: AccountType;
  balance: number;
  currency: string;
  creditDetails?: ICreditDetails;  // только для type = 'credit'
}
