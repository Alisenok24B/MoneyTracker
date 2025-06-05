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
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);