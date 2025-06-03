import { IsString } from 'class-validator';

export namespace SharedAccessList {
  export const topic = 'sharedAccess.list.query';

  export class Request { @IsString() userId!: string; }
  export class Response { peers!: string[]; }        // id-шники peer-ов
}