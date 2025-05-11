import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ITransaction, TransactionType } from '@moneytracker/interfaces';

@Schema({ timestamps: true })
export class Transaction extends Document implements ITransaction {
  override _id: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Account', required: true })
  accountId: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: string;

  @Prop({ required: true, type: String, enum: Object.values(TransactionType) as string[] })
  type: TransactionType;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: Date;

  @Prop()
  description?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
