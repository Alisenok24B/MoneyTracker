import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IUser } from '@moneytracker/interfaces';

@Schema()
export class User extends Document implements IUser {
  override _id: string; // Переопределение _id как string

  @Prop({required: true})
  displayName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);