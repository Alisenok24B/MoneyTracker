import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AccountType, ICreditCardDetails } from '@moneytracker/interfaces';

export type AccountDocument = Account & Document;

@Schema({ timestamps: true, versionKey: false })
export class Account {
  @Prop({ type: Types.ObjectId, required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(AccountType),
  })
  type: AccountType;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ required: true, default: 'RUB' })
  currency: string;

  // Детальные поля кредитной карты
  @Prop({ type: Object, default: null })
  creditDetails?: ICreditCardDetails;

  // Soft-delete
  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
