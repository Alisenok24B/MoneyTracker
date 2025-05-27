// libs/contracts/src/lib/transaction/transaction.create.ts
import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export namespace TransactionCreate {
  export const topic = 'transaction.create.command';

  export class Request {
    @IsString() userId: string;
    @IsString() accountId: string;
    @IsString() categoryId: string;
    @IsOptional() @IsString() periodId?: string; // только для кредитных карт
    @IsOptional() @IsString() toAccountId?: string; // только для transfer
    @IsNumber() amount: number;
    @IsDateString() @Type(() => Date) date: Date;
    @IsOptional() @IsString() description?: string;
  }

  export class Response {}
}
