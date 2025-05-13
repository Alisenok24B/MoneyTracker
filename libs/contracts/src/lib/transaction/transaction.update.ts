// libs/contracts/src/lib/transaction/transaction.update.ts
import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export namespace TransactionUpdate {
  export const topic = 'transaction.update.command';

  export class Request {
    @IsString() userId: string;
    @IsString() id: string;
    @IsOptional() @IsString() accountId?: string;
    @IsOptional() @IsString() categoryId?: string;
    @IsOptional() @IsString() toAccountId?: string; // только для transfer-категории
    @IsOptional() @IsNumber() amount?: number;
    @IsOptional() @IsDateString() @Type(() => Date) date?: Date;
    @IsOptional() @IsString() description?: string;
  }

  export class Response {}
}
