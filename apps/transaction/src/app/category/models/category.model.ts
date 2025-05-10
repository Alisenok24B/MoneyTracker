import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CategoryIcon, CategoryType } from '@moneytracker/interfaces';

@Schema({ _id: true, timestamps: true })
export class Category extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, required: true, enum: Object.values(CategoryType) })
  type: CategoryType;

  @Prop({ type: String, required: true, enum: Object.values(CategoryIcon) })
  icon: CategoryIcon;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: string | null;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}
export const CategorySchema = SchemaFactory.createForClass(Category);