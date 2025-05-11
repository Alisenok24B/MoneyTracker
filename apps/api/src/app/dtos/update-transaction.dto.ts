import { TransactionType } from '@moneytracker/interfaces';
import { IsOptional, IsString, IsIn, IsNumber, IsDateString, IsEnum } from 'class-validator';

export class UpdateTransactionDto {
  @IsOptional()
  @IsString()
  accountId?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsEnum(TransactionType, { message: 'type must be income or expense' })
  type?: TransactionType;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
