import { IsString, IsIn, IsOptional, ValidateNested, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { AccountType, BillingCycleType, ICreditCardDetails } from '@moneytracker/interfaces';

class CreditDetailsUpdateDto implements Partial<ICreditCardDetails> {
  @IsOptional() @IsNumber() creditLimit?: number;
  @IsOptional() @IsNumber() gracePeriodDays?: number;
  @IsOptional() @IsIn(['fixed','calendar','perPurchase']) billingCycleType?: BillingCycleType;
  @IsOptional() @IsNumber() billingCycleLengthDays?: number;
  @IsOptional() @IsNumber() billingCycleStartDayOfMonth?: number;
  @IsOptional() @IsNumber() paymentPeriodDays?: number;
  @IsOptional() @IsNumber() interestRate?: number;
  @IsOptional() @IsNumber() annualFee?: number;
  @IsOptional() @IsNumber() cashWithdrawalFeePercent?: number;
  @IsOptional() @IsNumber() cashWithdrawalFeeFixed?: number;
  @IsOptional() @IsNumber() cashWithdrawalLimitPerMonth?: number;
}

export class UpdateAccountDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() currency?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreditDetailsUpdateDto)
  creditDetails?: CreditDetailsUpdateDto;
}
