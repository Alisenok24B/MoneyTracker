import { IsString } from 'class-validator';

export namespace SharedAccessTerminate {
  export const topic = 'sharedAccess.terminate.command';

  export class Request {
    @IsString() userId!: string; // кто инициирует расторжение
    @IsString() peerId!: string; // с кем рвём связь
  }

  export class Response {}
}