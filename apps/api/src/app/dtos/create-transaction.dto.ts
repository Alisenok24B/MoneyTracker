// apps/api/src/app/dtos/create-transaction.dto.ts
import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  accountId: string;

  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  toAccountId?: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  description?: string;
}
