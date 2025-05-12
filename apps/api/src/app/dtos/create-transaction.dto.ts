// apps/api/src/app/dtos/create-transaction.dto.ts
import { IsString, IsIn, IsNumber, IsDateString, IsOptional, IsEnum, ValidateIf } from 'class-validator';
import { TransactionType } from '@moneytracker/interfaces';

export class CreateTransactionDto {
  @IsString()
  accountId: string;

  /** только для income/expense */
  @ValidateIf(o => o.type !== 'transfer')
  @IsString()
  categoryId?: string;

  /** только для transfer */
  @ValidateIf(o => o.type === 'transfer')
  @IsString()
  toAccountId?: string;

  @IsEnum(TransactionType, { message: 'type must be income or expense' })
  type: TransactionType;

  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  description?: string;
}
