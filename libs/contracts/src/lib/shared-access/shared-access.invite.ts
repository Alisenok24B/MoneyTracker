import { IsString } from 'class-validator';

export namespace SharedAccessInvite {
  export const topic = 'sharedAccess.invite.command';

  export class Request {
    @IsString() fromUserId!: string;   // инициатор
    @IsString() toUserId!: string;     // кому
  }

  export class Response {}            // пусто
}