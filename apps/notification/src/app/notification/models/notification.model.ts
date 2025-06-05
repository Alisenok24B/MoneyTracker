import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId!: string;

  @Prop({ type: String, required: true })
  text!: string;

  @Prop({ type: Boolean, default: false })
  read!: boolean;

  @Prop({ type: Date })
  createdAt!: Date;

  /** интерактивное («нужно действие») */
  @Prop({ type: Boolean, default: false })
  requiresResponse!: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);