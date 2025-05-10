import { IsString, IsOptional, IsEnum } from 'class-validator';
import { CategoryType, ICategory } from '@moneytracker/interfaces';

export namespace CategoryList {
  export const topic = 'category.list.query';

  export class Request {
    @IsString()
    userId: string;

    @IsOptional()
    @IsEnum(CategoryType, { message: 'type must be income or expense' })
    type?: CategoryType;
  }

  export class Response {
    categories: ICategory[];
  }
}