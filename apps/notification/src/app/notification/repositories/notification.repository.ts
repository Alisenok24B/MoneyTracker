import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification
} from '../models/notification.model';

@Injectable()
export class NotificationRepo {
  constructor(
    @InjectModel(Notification.name)
    private readonly model: Model<Notification>,
  ) {}

  create(userId: string, text: string) {
    return new this.model({ userId, text }).save();
  }

  markRead(id: string) {
    return this.model.updateOne({ _id: id }, { $set: { read: true } }).exec();
  }

  findUnread(userId: string) {
    return this.model
      .find({ userId, read: false }, { _id: 1, text: 1, read: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }
}