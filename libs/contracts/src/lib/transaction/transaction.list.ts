import { IsString, IsOptional, IsArray } from 'class-validator';
import { ITransaction } from '@moneytracker/interfaces';

export namespace TransactionList {
  export const topic = 'transaction.list.query';

  export class Request {
    @IsString() userId: string;
    @IsString() accountId: string;
    @IsOptional() @IsArray() @IsString({ each: true }) peers?: string[];
  }

  export class Response {
    transactions: ITransaction[];
  }
}
