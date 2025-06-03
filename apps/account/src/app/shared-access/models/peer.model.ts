import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type PeerDocument = Peer & Document;

@Schema({ versionKey:false })
export class Peer {
  @Prop({ type: Types.ObjectId, required: true, index: true }) userId!: string;
  @Prop({ type: Types.ObjectId, required: true }) peerId!: string;
}
export const PeerSchema = SchemaFactory.createForClass(Peer);
PeerSchema.index({ userId:1, peerId:1 }, { unique:true });