export enum TransactionType {
    Income  = 'income',
    Expense = 'expense',
    Transfer = 'transfer'
}

export interface ITransaction {
    _id?: string;
    userId: string;
    accountId: string;
    categoryId?: string;
    toAccountId?: string;

    type: TransactionType;
    amount: number;
    date: Date;
    description?: string;
    deletedAt?: Date;
  }
  