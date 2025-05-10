import { CategoryType } from '@moneytracker/interfaces';
import { IsOptional, IsEnum } from 'class-validator';

export class ListCategoriesDto {
  @IsOptional()
  @IsEnum(CategoryType, { message: 'type must be income or expense' })
  type?: CategoryType;
}