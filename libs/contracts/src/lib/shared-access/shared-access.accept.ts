import { IsString } from 'class-validator';

export namespace SharedAccessAccept {
  export const topic = 'sharedAccess.accept.command';

  export class Request {
    @IsString() userId!: string;       // принимающий (toUserId)
    @IsString() inviteId!: string;     // id приглашения
  }
  export class Response {}
}