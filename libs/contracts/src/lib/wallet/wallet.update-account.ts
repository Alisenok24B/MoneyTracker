import {
  IsString,
  IsOptional,
  IsIn,
  ValidateNested,
  IsNumber,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BillingCycleType, ICreditCardDetails } from '@moneytracker/interfaces';

export namespace AccountUpdate {
  export const topic = 'wallet.update-account.command';

  class CreditDto implements Partial<ICreditCardDetails> {
    @IsOptional() @IsNumber() creditLimit?: number;
    @IsOptional() @IsNumber() gracePeriodDays?: number;
    @IsOptional()
    @IsIn(Object.values(['fixed','calendar','perPurchase']) as BillingCycleType[])
    billingCycleType?: BillingCycleType;
    @IsOptional() @IsNumber() billingCycleLengthDays?: number;
    @IsOptional() @IsNumber() billingCycleStartDayOfMonth?: number;
    @IsOptional() @IsNumber() paymentPeriodDays?: number;
    @IsOptional() @IsNumber() interestRate?: number;
    @IsOptional() @IsNumber() annualFee?: number;
    @IsOptional() @IsNumber() cashWithdrawalFeePercent?: number;
    @IsOptional() @IsNumber() cashWithdrawalFeeFixed?: number;
    @IsOptional() @IsNumber() cashWithdrawalLimitPerMonth?: number;
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
    @IsString()
    currency?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreditDto)
    creditDetails?: CreditDto;
  }

  export class Response {}
}
