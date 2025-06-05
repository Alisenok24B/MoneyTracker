import { IsString } from 'class-validator';

export namespace NotificationRead {
  export const topic = 'notification.read.command';

  /** Отметить уведомление прочитанным */
  export class Request {
    @IsString() notificationId!: string;
  }
  export class Response {}
}