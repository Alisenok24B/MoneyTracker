import { IsString, IsNumber, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  accountId: string;

  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  toAccountId?: string;

  @IsOptional()
  @IsString()
  periodId?: string;

  // флаг для overdue-пополнений
  @IsOptional() @IsBoolean()
  hasInterest?: boolean;

  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  description?: string;
}
