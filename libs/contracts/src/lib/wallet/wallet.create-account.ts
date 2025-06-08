import { IsString, IsIn, IsOptional, IsNumber, ValidateNested, ValidateIf } from 'class-validator';
import { BillingCycleType, ICreditCardDetails } from '@moneytracker/interfaces';
import { Type } from 'class-transformer';

export namespace AccountCreate {
  export const topic = 'account.create.command';

  class CreditDto implements ICreditCardDetails {
    @IsNumber() creditLimit: number;

    @IsIn(['fixed','calendar','perPurchase'] as BillingCycleType[]) billingCycleType: BillingCycleType;

    @ValidateIf(o => o.billingCycleType === 'fixed')
    @IsOptional()
    statementAnchor?: Date;

    @IsNumber()
    @ValidateIf(o => o.billingCycleType === 'fixed' || o.billingCycleType === 'perPurchase')
    @IsOptional()
    gracePeriodDays?: number;

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
    @IsIn(['savings', 'debit', 'creditCard', 'cash']) type: string;
    @IsOptional() @IsString() currency?: string;
    // initial balance обязателен, если не кредитная карта
    @ValidateIf(o => o.type !== 'creditCard')
    @IsNumber()
    balance: number;
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
