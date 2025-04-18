import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IUser, IUserCourses, PurchaseState, UserRole } from '@moneytracker/interfaces';

@Schema()
export class UserCourses extends Document implements IUserCourses {
  override _id: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true, enum: PurchaseState, type: String })
  purchaseState: PurchaseState;
}

export const UserCoursesSchema = SchemaFactory.createForClass(UserCourses);

@Schema()
export class User extends Document implements IUser {
  override _id: string; // Переопределение _id как string

  @Prop()
  displayName?: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: UserRole, type: String, default: UserRole.Student })
  role: UserRole;

  @Prop({ type: [UserCoursesSchema], _id: false })
  courses: Types.Array<UserCourses>
}

export const UserSchema = SchemaFactory.createForClass(User);