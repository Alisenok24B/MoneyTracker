import { BalanceHistoryEntry } from '@moneytracker/interfaces';
import { IsString, IsOptional, IsArray, IsISO8601 } from 'class-validator';

export namespace AccountsBalanceHistory {
  export const topic = 'wallet.account.balance-history.query';

  export class Request {
    @IsString()                userId!: string;
    @IsOptional() @IsArray() @IsString({ each: true })
    peers?: string[];
    @IsOptional() @IsArray() @IsString({ each: true })
    accountIds?: string[];
    @IsOptional() @IsArray() @IsISO8601({}, { each: true })
    dates?: string[];
  }

  export class Response {
    history!: BalanceHistoryEntry[];
  }
}