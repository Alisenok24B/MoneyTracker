import { IsBoolean, IsOptional, IsString } from 'class-validator';

export namespace NotificationSend {
  export const topic = 'notification.send.command';
  export class Request {
    @IsString() userId!: string; // получатель
    @IsString() text!: string;
    @IsOptional() @IsBoolean() requiresResponse?: boolean = false; // true → уведомление интерактивное, требует ответ (например, «invite»)
    @IsOptional() @IsString() inviteId?: string;
  }
  export class Response {}
}