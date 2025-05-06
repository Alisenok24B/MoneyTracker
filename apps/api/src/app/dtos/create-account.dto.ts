import { IsString, IsIn, IsOptional, ValidateNested, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { AccountType, BillingCycleType, ICreditCardDetails } from '@moneytracker/interfaces';

class CreditDetailsDto implements ICreditCardDetails {
  @IsNumber()
  creditLimit: number;

  @IsNumber()
  gracePeriodDays: number;

  @IsIn(['fixed','calendar','perPurchase'])
  billingCycleType: BillingCycleType;

  @IsOptional()
  @IsNumber()
  billingCycleLengthDays?: number;

  @IsOptional()
  @IsNumber()
  billingCycleStartDayOfMonth?: number;

  @IsNumber()
  paymentPeriodDays: number;

  @IsNumber()
  interestRate: number;

  @IsOptional()
  @IsNumber()
  annualFee?: number;

  @IsOptional()
  @IsNumber()
  cashWithdrawalFeePercent?: number;

  @IsOptional()
  @IsNumber()
  cashWithdrawalFeeFixed?: number;

  @IsOptional()
  @IsNumber()
  cashWithdrawalLimitPerMonth?: number;

  @IsOptional()
  @IsNumber()
  cashbackPercentMax?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cashbackCategories?: string[];
}

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsIn(Object.values(AccountType))
  type: AccountType;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreditDetailsDto)
  creditDetails?: CreditDetailsDto;
}