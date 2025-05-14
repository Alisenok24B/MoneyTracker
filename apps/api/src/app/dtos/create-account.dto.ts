import { IsString, IsIn, IsOptional, ValidateNested, IsNumber, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { AccountType, BillingCycleType, ICreditCardDetails } from '@moneytracker/interfaces';

class CreditDetailsDto implements ICreditCardDetails {
  @IsNumber()
  creditLimit: number;

  @IsNumber()
  gracePeriodDays: number;

  @IsIn(['fixed','calendar','perPurchase'])
  billingCycleType: BillingCycleType;

  @ValidateIf(o => o.billingCycleType === 'fixed')
  @IsNumber()
  billingCycleLengthDays: number;

  @ValidateIf(o => o.billingCycleType === 'calendar')
  @IsNumber()
  billingCycleStartDayOfMonth: number;

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
}

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsIn(Object.values(AccountType))
  type: AccountType;

  @ValidateIf(o => o.type !== AccountType.CreditCard)
  @IsNumber()
  @Type(() => Number)
  balance: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreditDetailsDto)
  creditDetails?: CreditDetailsDto;
}