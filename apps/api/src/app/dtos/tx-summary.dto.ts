import { IsIn, IsOptional, IsArray, IsISO8601, IsString } from 'class-validator';
import { FlowType } from '@moneytracker/interfaces';

export class TxSummaryDto {
  @IsIn(['income', 'expense']) type!: FlowType;

  @IsOptional() @IsArray() @IsString({ each: true })
  accountIds?: string[];

  @IsOptional() @IsISO8601() from?: string;
  @IsOptional() @IsISO8601() to?:   string;
}