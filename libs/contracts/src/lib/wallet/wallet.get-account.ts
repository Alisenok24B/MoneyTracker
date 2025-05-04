import { IsString } from 'class-validator';

export namespace AccountGet {
  export const topic = 'account.get.query';

  export class Request {
    @IsString() userId: string;
    @IsString() id: string;
  }

  export class Response {
    account: any;  // здесь IAccount
  }
}
