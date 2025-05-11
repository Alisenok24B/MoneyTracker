import { IsString, IsOptional, IsArray } from 'class-validator';

export class TransactionIdDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  peers?: string[];
}
