// libs/contracts/src/lib/user/user.search.ts
import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export namespace UserSearch {
  export const topic = 'user.search.query';

  export class Request {
    @IsString()              // подстрока e-mail'а
    query: string;

    @IsOptional() @IsInt() @Min(1) @Max(50)
    limit?: number = 10;     // (по умолчанию 10)
  }

  export class Response {
    users: { id: string; email: string; displayName: string | null }[];
  }
}