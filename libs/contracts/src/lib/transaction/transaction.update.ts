// libs/contracts/src/lib/transaction/transaction.update.ts
import { IsString, IsOptional, IsNumber, IsDateString, IsEnum, ValidateIf } from 'class-validator';
import { ITransaction, TransactionType } from '@moneytracker/interfaces';
import { Type } from 'class-transformer';

export namespace TransactionUpdate {
  export const topic = 'transaction.update.command';

  export class Request {
    @IsString() userId: string;
    @IsString() id: string;
    @IsOptional() @IsEnum(TransactionType) type?: TransactionType;
    @IsOptional() @IsString() accountId?: string;

    @ValidateIf(o => o.type !== 'transfer')
    @IsOptional() @IsString()
    categoryId?: string;
    
    @ValidateIf(o => o.type === 'transfer')
    @IsOptional() @IsString()
    toAccountId?: string;

    @IsOptional() @IsNumber() amount?: number;
    @IsOptional() @IsDateString() @Type(() => Date) date?: Date;
    @IsOptional() @IsString() description?: string;
  }

  export class Response {
    transaction: ITransaction;
  }
}
