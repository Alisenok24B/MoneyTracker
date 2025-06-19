import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { ICategory, CategoryIcon, FlowType } from '@moneytracker/interfaces';

export namespace CategoryCreate {
  export const topic = 'category.create.command';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    name: string;

    @IsEnum(FlowType, { message: 'type must be income or expense' })
    type: FlowType;

    @IsEnum(CategoryIcon)
    icon: CategoryIcon;
    @IsOptional() @IsArray() @IsString({ each:true }) peers?: string[];
  }

  export class Response {
    category: ICategory;
  }
}