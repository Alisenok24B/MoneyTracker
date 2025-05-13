import { IsString, IsOptional, IsArray, IsIn } from 'class-validator';
import { ITransaction, FlowType } from '@moneytracker/interfaces';

export namespace TransactionList {
  export const topic = 'transaction.list.query';

  export class Request {
    @IsString()
    userId: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    peers?: string[];

    /** --- новые фильтры --- */
    @IsOptional() @IsArray() @IsString({ each: true })
    accountIds?: string[];

    @IsOptional() @IsArray() @IsString({ each: true })
    userIds?: string[];

    @IsOptional() @IsArray() @IsString({ each: true })
    categoryIds?: string[];

    @IsOptional()
    @IsIn(Object.values(FlowType))
    type?: FlowType;
  }

  export class Response {
    transactions: ITransaction[];
  }
}