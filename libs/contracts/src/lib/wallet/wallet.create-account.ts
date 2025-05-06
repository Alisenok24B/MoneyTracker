import { IsString, IsIn, IsOptional, IsNumber, ValidateNested, IsArray } from 'class-validator';
import { BillingCycleType, ICreditCardDetails } from '@moneytracker/interfaces';
import { Type } from 'class-transformer';

export namespace AccountCreate {
  export const topic = 'account.create.command';

  class CreditDto implements ICreditCardDetails {
    @IsNumber() creditLimit: number;
    @IsNumber() gracePeriodDays: number;
    @IsIn(['fixed','calendar','perPurchase'] as BillingCycleType[]) billingCycleType: BillingCycleType;
    @IsOptional() @IsNumber() billingCycleLengthDays?: number;
    @IsOptional() @IsNumber() billingCycleStartDayOfMonth?: number;
    @IsNumber() paymentPeriodDays: number;
    @IsNumber() interestRate: number;
    @IsOptional() @IsNumber() annualFee?: number;
    @IsOptional() @IsNumber() cashWithdrawalFeePercent?: number;
    @IsOptional() @IsNumber() cashWithdrawalFeeFixed?: number;
    @IsOptional() @IsNumber() cashWithdrawalLimitPerMonth?: number;
  }

  export class Request {
    @IsString() userId: string;
    @IsString() name: string;
    @IsIn(['savings', 'debit', 'creditCard']) type: string;
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
