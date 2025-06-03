import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type InviteDocument = Invite & Document;

@Schema({ timestamps: true })
export class Invite {
  @Prop({ type: Types.ObjectId, required: true }) fromUserId!: string;
  @Prop({ type: Types.ObjectId, required: true }) toUserId!: string;
  @Prop({ type: String, enum: ['pending','accepted','rejected'], default: 'pending' })
  status!: 'pending'|'accepted'|'rejected';
}
export const InviteSchema = SchemaFactory.createForClass(Invite);