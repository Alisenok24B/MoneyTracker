import { IsString } from 'class-validator';

export namespace NotificationSend {
  export const topic = 'notification.send.command';
  export class Request {
    @IsString() userId!: string;        // получатель
    @IsString() text!: string;
  }
  export class Response {}
}