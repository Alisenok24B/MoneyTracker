export enum TransactionType {
    Income  = 'income',
    Expense = 'expense',
}

export interface ITransaction {
    _id?: string;
    userId: string;
    accountId: string;
    categoryId: string;
    type: TransactionType;
    amount: number;
    date: Date;
    description?: string;
    deletedAt?: Date;
  }
  