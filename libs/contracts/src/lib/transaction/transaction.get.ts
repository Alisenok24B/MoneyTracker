import { IsArray, IsOptional, IsString } from 'class-validator';
import { ITransaction } from '@moneytracker/interfaces';

export namespace TransactionGet {
  export const topic = 'transaction.get.query';

  export class Request {
    @IsString() userId: string;
    @IsOptional() @IsArray() @IsString({ each: true }) peers?: string[];
    @IsString() id: string;
  }

  export class Response {
  transaction: ITransaction;
  }
}
