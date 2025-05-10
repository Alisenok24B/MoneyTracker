import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CreditPeriodDocument = CreditPeriod & Document;

@Schema({ timestamps: true })
export class CreditPeriod {
  @Prop({ type: Types.ObjectId, required: true })
  accountId: string;

  @Prop({ required: true })
  periodStart: Date;

  @Prop({ required: true })
  periodEnd: Date;

  @Prop({ required: true })
  paymentDue: Date;

  @Prop({ required: true, default: 'open' })
  status: 'open' | 'due' | 'overdue';
}

export const CreditPeriodSchema = SchemaFactory.createForClass(CreditPeriod);