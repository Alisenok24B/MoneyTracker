import { IsString, IsIn, IsOptional, IsNumber, ValidateNested } from 'class-validator';
import { ICreditDetails } from '@moneytracker/interfaces';
import { Type } from 'class-transformer';

export namespace AccountCreate {
  export const topic = 'account.create.command';

  class CreditDto implements ICreditDetails {
    @IsNumber() creditLimit: number;
    @IsNumber() billingCycleStart: number;
    @IsString() nextBillingCycleDate: string;
  }

  export class Request {
    @IsString() userId: string;
    @IsString() name: string;
    @IsIn(['deposit', 'savings', 'debit', 'credit']) type: string;
    @IsOptional() @IsString() currency?: string;

    // Если credit
    @IsOptional()
    @ValidateNested()
    @Type(() => CreditDto)
    creditDetails?: CreditDto;
  }

  export class Response {
    accountId: string;
  }
}
