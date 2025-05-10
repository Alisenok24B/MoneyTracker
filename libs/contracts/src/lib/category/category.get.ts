import { IsString } from 'class-validator';
import { ICategory } from '@moneytracker/interfaces';

export namespace CategoryGet {
  export const topic = 'category.get.query';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    id: string;
  }

  export class Response {
    category: ICategory;
  }
}