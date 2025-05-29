import { FlowType } from "./common.types";

export interface ITransaction {
    _id?: string;
    userId: string;
    accountId: string;
    categoryId: string;
    toAccountId?: string; // только для transfer-категории
    type: FlowType;
    periodId?: string; // привязка к кредитному периоду
    hasInterest?: boolean; // флаг переплаты по просроченному периоду
    amount: number;
    date: Date;
    description?: string;
    deletedAt?: Date;
  }
  