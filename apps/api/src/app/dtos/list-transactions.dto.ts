import { IsOptional, IsArray, IsString, IsIn } from 'class-validator';
import { FlowType } from '@moneytracker/interfaces';

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
}