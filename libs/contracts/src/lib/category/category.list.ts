import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { FlowType, ICategory } from '@moneytracker/interfaces';

export namespace CategoryList {
  export const topic = 'category.list.query';

  export class Request {
    @IsString()
    userId: string;

    @IsOptional()
    @IsEnum(FlowType, { message: 'type must be income or expense' })
    type?: FlowType;

    @IsOptional() @IsArray() peers?: string[];
  }

  export class Response {
    categories: ICategory[];
  }
}