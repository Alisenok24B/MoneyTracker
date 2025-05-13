import { IsString, IsOptional, IsEnum } from 'class-validator';
import { FlowType, ICategory } from '@moneytracker/interfaces';

export namespace CategoryList {
  export const topic = 'category.list.query';

  export class Request {
    @IsString()
    userId: string;

    @IsOptional()
    @IsEnum(FlowType, { message: 'type must be income or expense' })
    type?: FlowType;
  }

  export class Response {
    categories: ICategory[];
  }
}