import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PeriodStatus } from '../entities/credit-period.entity';

export type CreditPeriodDocument = CreditPeriodModel & Document;

@Schema({ timestamps: true, versionKey: false })
export class CreditPeriodModel {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  accountId: string;

  @Prop({ type: Date, required: true })
  statementStart: Date;

  @Prop({ type: Date, required: true })
  statementEnd: Date;

  @Prop({ type: Date, required: true })
  paymentDue: Date;

  @Prop({ type: String, enum: ['open', 'payment', 'overdue', 'closed'], required: true })
  status: PeriodStatus;

  @Prop({ type: Number, default: 0 })
  totalSpent: number;

  @Prop({ type: Number, default: 0 })
  paidAmount: number;

  /** накопленные % по просрочке */
  @Prop({ type: Number, default: 0 })
  interestAccrued: number;

  /** начисляются ли проценты (true, если статус overdue) */
  @Prop({ type: Boolean, default: false })
  hasInterest: boolean;

  /** ставка (% годовых) сохраняется «срезом» при создании периода */
  @Prop({ type: Number, required: true })
  interestRate: number;

  /** soft-delete */
  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const CreditPeriodSchema = SchemaFactory.createForClass(CreditPeriodModel);