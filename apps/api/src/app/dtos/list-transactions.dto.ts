import { IsOptional, IsArray, IsString, IsIn } from 'class-validator';
import { TransactionType } from '@moneytracker/interfaces';

export class ListTransactionsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  peers?: string[];

  @IsOptional()
  @IsIn(Object.values(TransactionType))
  type?: TransactionType;
}