import { IsString } from 'class-validator';

export namespace NotificationListUnread {
  /** ← запрос */
  export const topic = 'notification.unread.query';

  export class Request {
    @IsString() userId!: string;
  }

  /** ← ответ */
  export class Response {
    notifications!: {
      _id:   string;
      text:  string;
      read:  boolean;
      requiresResponse: boolean;
      /** могут понадобиться даты на фронте */
      createdAt: Date;
      inviteId?: string;
    }[];
  }
}
