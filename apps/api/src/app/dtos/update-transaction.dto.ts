import { TransactionType } from '@moneytracker/interfaces';
import { IsOptional, IsString, IsIn, IsNumber, IsDateString, IsEnum, ValidateIf } from 'class-validator';

export class UpdateTransactionDto {
  @IsOptional()
  @IsString()
  accountId?: string;

  @ValidateIf(o => o.type !== 'transfer')
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ValidateIf(o => o.type === 'transfer')
  @IsOptional()
  @IsString()
  toAccountId?: string;

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
