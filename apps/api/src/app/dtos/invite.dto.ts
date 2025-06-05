import { IsString } from 'class-validator';

export class InviteDto {
  /** ID пользователя, которого приглашаем */
  @IsString()
  toUserId!: string;
}