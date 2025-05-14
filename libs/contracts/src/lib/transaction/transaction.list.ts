import { IsString, IsOptional, IsArray, IsIn, IsDateString, IsNumber } from 'class-validator';
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

    @IsOptional() @IsArray() @IsString({ each: true })
    accountIds?: string[];

    @IsOptional() @IsArray() @IsString({ each: true })
    userIds?: string[];

    @IsOptional() @IsArray() @IsString({ each: true })
    categoryIds?: string[];

    @IsOptional()
    @IsIn(Object.values(FlowType))
    type?: FlowType;

    @IsOptional() @IsDateString()
    date?: Date;          // ровно эту дату

    @IsOptional() @IsNumber()
    month?: number;       // 1–12

    @IsOptional() @IsNumber()
    year?: number;        // например, 2025

    @IsOptional() @IsDateString()
    from?: Date;          // начало диапазона (включительно)

    @IsOptional() @IsDateString()
    to?: Date;            // конец диапазона (включительно)
  }

  export class Response {
    transactions: ITransaction[];
  }
}