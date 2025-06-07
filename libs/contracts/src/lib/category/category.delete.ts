import { IsArray, IsOptional, IsString } from 'class-validator';

export namespace CategoryDelete {
  export const topic = 'category.delete.command';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    id: string;

    @IsOptional() @IsArray() peers?: string[];
  }

  export class Response {}
}