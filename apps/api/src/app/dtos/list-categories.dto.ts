import { FlowType } from '@moneytracker/interfaces';
import { IsOptional, IsEnum } from 'class-validator';

export class ListCategoriesDto {
  @IsOptional()
  @IsEnum(FlowType, { message: 'type must be income or expense' })
  type?: FlowType;
}