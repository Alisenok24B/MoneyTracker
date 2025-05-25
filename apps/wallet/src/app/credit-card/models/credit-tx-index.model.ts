import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CreditTxIndexDocument = CreditTxIndex & Document;

@Schema({ versionKey: false })
export class CreditTxIndex {
  @Prop({ type: Types.ObjectId, required: true, unique: true })
  txId: string;                       // id транзакции

  @Prop({ type: Types.ObjectId, required: true, index: true })
  periodId: string;                   // к какому периоду относится

  @Prop({ type: Types.ObjectId, required: true })
  accountId: string;                  // счёт, по которому операция

  @Prop({ type: String, enum: ['expense', 'income'], required: true })
  flow: 'expense' | 'income';         // направление (для перерасчёта)

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: Date, required: true })
  date: Date;
}

export const CreditTxIndexSchema = SchemaFactory.createForClass(CreditTxIndex);

/** уникальность транзакции **для конкретной карты** */
CreditTxIndexSchema.index({ txId: 1, accountId: 1 }, { unique: true });