import { IsOptional, IsString, IsEnum } from 'class-validator';
import { CategoryIcon } from '@moneytracker/interfaces';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(CategoryIcon, { message: 'icon must be a valid CategoryIcon' })
  icon?: CategoryIcon;
}