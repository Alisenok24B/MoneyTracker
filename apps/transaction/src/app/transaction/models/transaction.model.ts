import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ITransaction, FlowType } from '@moneytracker/interfaces';

@Schema({ timestamps: true })
export class Transaction extends Document implements ITransaction {
  override _id: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Account', required: true })
  accountId: string;

  // только для transfer
  @Prop({ type: Types.ObjectId, ref: 'Account' })
  toAccountId?: string;

  /** Только для income/transfer-операций по кредитной карте */
  @Prop({ type: Types.ObjectId, ref: 'CreditPeriod', required: false })
  periodId?: string;

  // только для income/expense
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: string;

  @Prop({ required: true, type: String, enum: Object.values(FlowType) as string[] })
  type: FlowType;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: Date;

  @Prop()
  description?: string;

  // Флаг: переплата по просроченному кредитному периоду
  @Prop({ type: Boolean, default: false })
  hasInterest?: boolean;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
