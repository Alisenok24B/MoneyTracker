import { IsString } from 'class-validator';

export class CategoryIdDto {
  @IsString()
  id: string;
}