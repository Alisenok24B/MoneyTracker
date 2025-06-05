import { IsString, IsIn } from 'class-validator';

export class RespondDto {
  /** ID приглашения */
  @IsString()
  inviteId!: string;

  /** 'accept' | 'reject' */
  @IsIn(['accept', 'reject'])
  action!: 'accept' | 'reject';
}