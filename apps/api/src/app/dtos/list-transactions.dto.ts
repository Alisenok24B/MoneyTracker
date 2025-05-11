import { IsString, IsOptional, IsArray } from 'class-validator';

export class ListTransactionsDto {
  @IsString()
  accountId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  peers?: string[];
}
