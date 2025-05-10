import { IsString } from 'class-validator';

export namespace CategoryDelete {
  export const topic = 'category.delete.command';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    id: string;
  }

  export class Response {}
}