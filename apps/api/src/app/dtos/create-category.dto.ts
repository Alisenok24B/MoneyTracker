import { IsString, IsEnum, IsIn } from 'class-validator';
import { CategoryIcon, CategoryType } from '@moneytracker/interfaces';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsEnum(CategoryType, { message: 'type must be income or expense' })
  type: CategoryType;

  @IsEnum(CategoryIcon, { message: 'icon must be a valid CategoryIcon' })
  icon: CategoryIcon;
}