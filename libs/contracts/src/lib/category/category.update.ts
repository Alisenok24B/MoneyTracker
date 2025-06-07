import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { CategoryIcon } from '@moneytracker/interfaces';

export namespace CategoryUpdate {
  export const topic = 'category.update.command';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    id: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEnum(CategoryIcon)
    icon?: CategoryIcon;

    @IsOptional() @IsArray() peers?: string[];
  }

  export class Response {}
}