import { AccountType } from "./account.interface";

export interface PaymentInfo {
    accountId: string;
    accountName: string;
    accountType: AccountType;
    periodId: string;
    status: 'payment' | 'overdue';
    paymentDue: string;  // YYYY-MM-DD
    debt: number;
  }