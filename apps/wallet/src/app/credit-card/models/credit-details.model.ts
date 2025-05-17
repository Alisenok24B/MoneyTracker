import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BillingCycleType, ICreditCardDetails } from '@moneytracker/interfaces';

export type CreditDetailsDocument = CreditDetailsModel & Document;

@Schema({ collection: 'creditDetails', versionKey: false, timestamps: true })
export class CreditDetailsModel implements ICreditCardDetails {
  @Prop({ required: true }) accountId: string;
  @Prop({ required: true }) creditLimit: number;
  @Prop({ required: true }) gracePeriodDays: number;
  @Prop({ required: true, type: String, enum: ['fixed', 'calendar', 'perPurchase'] as BillingCycleType[] })
  billingCycleType: BillingCycleType;
  @Prop() billingCycleLengthDays?: number;
  @Prop() billingCycleStartDayOfMonth?: number;
  @Prop({ required: true }) paymentPeriodDays: number;
  @Prop({ required: true }) interestRate: number;
  @Prop() annualFee?: number;
  @Prop() cashWithdrawalFeePercent?: number;
  @Prop() cashWithdrawalFeeFixed?: number;
  @Prop() cashWithdrawalLimitPerMonth?: number;
  @Prop({ type: Date, default: null }) deletedAt?: Date;
}

export const CreditDetailsSchema = SchemaFactory
  .createForClass(CreditDetailsModel);