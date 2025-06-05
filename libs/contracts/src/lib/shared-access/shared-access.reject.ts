import { IsString } from 'class-validator';

export namespace SharedAccessReject {
  export const topic = 'sharedAccess.reject.command';

  export class Request {
    /** кто отклоняет (toUserId) */
    @IsString() userId!: string;
    /** id приглашения */
    @IsString() inviteId!: string;
  }

  export class Response {}
}