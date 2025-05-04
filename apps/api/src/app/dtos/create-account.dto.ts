import { IsString, IsIn, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { AccountType } from '@moneytracker/interfaces';

class CreditDetailsDto {
  @IsNumber() creditLimit: number;
  @IsNumber() billingCycleStart: number;
  @IsString() nextBillingCycleDate: string;
}

export class CreateAccountDto {
  @IsString() name: string;
  @IsIn(Object.values(AccountType)) type: AccountType;
  @IsOptional() @IsString() currency?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreditDetailsDto)
  creditDetails?: CreditDetailsDto;
}
