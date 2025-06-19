import { IsArray, IsOptional, IsString } from 'class-validator';

export namespace AccountDelete {
  export const topic = 'account.delete.command';

  export class Request {
    @IsString() userId: string;
    @IsString() id: string;
    @IsOptional() @IsArray() @IsString({ each:true }) peers?: string[];
  }

  export class Response {}
}
