// libs/contracts/src/lib/transaction/transaction.create.ts
import { IsString, IsNumber, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ITransaction, TransactionType } from '@moneytracker/interfaces';
import { Type } from 'class-transformer';

export namespace TransactionCreate {
  export const topic = 'transaction.create.command';

  export class Request implements Omit<ITransaction, '_id' | 'deletedAt'> {
    @IsString() userId: string;
    @IsString() accountId: string;
    @IsString() categoryId: string;
    @IsEnum(TransactionType) type: TransactionType;
    @IsNumber() amount: number;
    @IsDateString() @Type(() => Date) date: Date;
    @IsOptional() @IsString() description?: string;
  }

  export class Response {
    transaction: ITransaction;
  }
}
