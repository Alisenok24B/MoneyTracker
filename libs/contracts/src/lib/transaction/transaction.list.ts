import { IsString, IsOptional, IsArray, IsIn } from 'class-validator';
import { ITransaction, TransactionType } from '@moneytracker/interfaces';

export namespace TransactionList {
  export const topic = 'transaction.list.query';

  export class Request {
    @IsString()
    userId: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    peers?: string[];

    @IsOptional()
    @IsIn(Object.values(TransactionType))
    type?: TransactionType;
  }

  export class Response {
    transactions: ITransaction[];
  }
}