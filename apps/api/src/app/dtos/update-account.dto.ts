import { IsString, IsIn, IsOptional, ValidateNested, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { AccountType, BillingCycleType, ICreditCardDetails } from '@moneytracker/interfaces';

class CreditDetailsUpdateDto implements Partial<ICreditCardDetails> {
  @IsOptional() @IsNumber() creditLimit?: number;
}

export class UpdateAccountDto {
  @IsOptional() @IsString() name?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreditDetailsUpdateDto)
  creditDetails?: CreditDetailsUpdateDto;
}
