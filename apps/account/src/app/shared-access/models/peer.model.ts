// apps/account/src/app/shared-access/models/peer-link.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type PeerLinkDocument = Peer & Document;

@Schema({ versionKey: false, timestamps: true })
export class Peer {
  /** Ровно два участника, сохранённые в отсортированном порядке */
  @Prop({ type: [Types.ObjectId], required: true, length: 2 })
  members!: [string, string];               // напр. ['64…a1', '64…f3']
}

/*  уникальность множества участников  */
export const PeerSchema = SchemaFactory.createForClass(Peer);
PeerSchema.index({ members: 1 }, { unique: true });