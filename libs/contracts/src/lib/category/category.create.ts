import { IsString, IsEnum } from 'class-validator';
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
  }

  export class Response {
    category: ICategory;
  }
}