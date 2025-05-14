import { IsOptional, IsArray, IsString, IsIn, IsDateString, IsNumber, Min, Max } from 'class-validator';
import { FlowType } from '@moneytracker/interfaces';
import { Type } from 'class-transformer';

export class ListTransactionsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  peers?: string[];

  @IsOptional() @IsArray() @IsString({ each: true })
  accountIds?: string[];

  @IsOptional() @IsArray() @IsString({ each: true })
  userIds?: string[];

  @IsOptional() @IsArray() @IsString({ each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsIn(Object.values(FlowType))
  type?: FlowType;

  @IsOptional() @IsDateString()
  date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(12)
  month?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number;

  @IsOptional() @IsDateString()
  from?: string;

  @IsOptional() @IsDateString()
  to?: string;
}