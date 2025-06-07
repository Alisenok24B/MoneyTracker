import { IsArray, IsOptional, IsString } from 'class-validator';

export namespace TransactionDelete {
  export const topic = 'transaction.delete.command';

  export class Request {
    @IsString() userId: string;
    @IsString() id: string;
  }

  export class Response {}
}
