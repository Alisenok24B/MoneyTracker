import { IsString } from 'class-validator';

export class AccountIdDto {
  @IsString()
  id: string;
}
