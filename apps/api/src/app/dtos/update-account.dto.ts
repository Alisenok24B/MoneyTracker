import { IsString, IsIn, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { AccountType } from '@moneytracker/interfaces';

class CreditDetailsUpdateDto {
  @IsOptional() @IsNumber() creditLimit?: number;
  @IsOptional() @IsNumber() billingCycleStart?: number;
  @IsOptional() @IsString() nextBillingCycleDate?: string;
}

export class UpdateAccountDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsIn(Object.values(AccountType)) type?: AccountType;
  @IsOptional() @IsString() currency?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreditDetailsUpdateDto)
  creditDetails?: CreditDetailsUpdateDto;
}
