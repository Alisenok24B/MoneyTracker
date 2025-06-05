import { IsString } from 'class-validator';

export namespace NotificationRead {
  export const topic = 'notification.read.command';

  /** Отметить уведомление прочитанным */
  export class Request {
    @IsString() userId!: string; // кому принадлежит
    @IsString() notificationId!: string; // id уведомления
  }
  export class Response {}
}