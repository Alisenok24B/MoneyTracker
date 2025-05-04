import { IsOptional, IsArray, IsString } from 'class-validator';

export class ListAccountsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  peers?: string[];
}
