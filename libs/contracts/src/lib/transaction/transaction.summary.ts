import { IsString, IsArray, IsOptional, IsISO8601, IsIn } from 'class-validator';
import { FlowType } from '@moneytracker/interfaces';

export namespace TransactionSummary {
  export const topic = 'transaction.summary.query';

  export class Request {
    @IsString() userId!: string;
    @IsArray()  @IsString({ each: true }) peers!: string[];

    @IsIn(['income', 'expense']) type!: FlowType;

    @IsOptional() @IsArray() @IsString({ each: true })
    accountIds?: string[];

    @IsOptional() @IsISO8601() from?: string;
    @IsOptional() @IsISO8601() to?:   string;
  }

  export class Response {
    total!: number;
    breakdown!: Array<{
      categoryId: string;
      name: string;
      amount: number;
      percent: number;
    }>;
  }
}