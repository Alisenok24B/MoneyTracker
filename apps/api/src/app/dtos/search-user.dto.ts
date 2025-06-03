import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

/** DTO для POST /user/search */
export class SearchUserDto {
  @IsString()
  query: string;              // подстрока e-mail'а

  @IsOptional() @IsInt() @Min(1) @Max(50)
  limit?: number;             // (по умолчанию 10)
}