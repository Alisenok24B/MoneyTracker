import { IsString, IsOptional, IsArray } from 'class-validator';

export namespace AccountList {
  export const topic = 'account.list.query';

  export class Request {
    @IsString() userId: string;
    @IsOptional() @IsArray() peers?: string[];  // для совместного доступа
    @IsOptional() lite?: boolean;
  }

  export class Response {
    accounts: any[];  // в теле будут объекты IAccount, но RMQ-контракты обычно не типизируют глубоко
  }
}
