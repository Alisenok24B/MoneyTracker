import { IsOptional, IsArray, IsISO8601, IsString } from 'class-validator';

export class BalanceHistoryDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accountIds?: string[];

  @IsOptional()
  @IsArray()
  @IsISO8601({}, { each: true })
  dates?: string[];    // ISO-строки, например "2025-06-01"
}