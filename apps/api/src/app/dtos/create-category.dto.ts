import { IsString, IsEnum, IsIn } from 'class-validator';
import { CategoryIcon, FlowType } from '@moneytracker/interfaces';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsEnum(FlowType, { message: 'type must be income or expense' })
  type: FlowType;

  @IsEnum(CategoryIcon, { message: 'icon must be a valid CategoryIcon' })
  icon: CategoryIcon;
}