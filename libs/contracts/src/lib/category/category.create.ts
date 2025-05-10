import { IsString, IsEnum } from 'class-validator';
import { ICategory, CategoryIcon, CategoryType } from '@moneytracker/interfaces';

export namespace CategoryCreate {
  export const topic = 'category.create.command';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    name: string;

    @IsEnum(CategoryType, { message: 'type must be income or expense' })
    type: CategoryType;

    @IsEnum(CategoryIcon)
    icon: CategoryIcon;
  }

  export class Response {
    category: ICategory;
  }
}