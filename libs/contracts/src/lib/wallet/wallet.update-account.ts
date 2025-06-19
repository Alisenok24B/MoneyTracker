import {
  IsString,
  IsOptional,
  ValidateNested,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ICreditCardDetails } from '@moneytracker/interfaces';

export namespace AccountUpdate {
  export const topic = 'wallet.update-account.command';

  class CreditDto implements Partial<ICreditCardDetails> {
    @IsOptional() @IsNumber() creditLimit?: number;
  }

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    id: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreditDto)
    creditDetails?: CreditDto;
    @IsOptional() @IsArray() @IsString({ each:true }) peers?: string[];
  }

  export class Response {}
}
