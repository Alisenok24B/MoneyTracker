import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification
} from '../models/notification.model';
import { NotificationEntity } from '../entities/notification.entity';

@Injectable()
export class NotificationRepo {
  constructor(
    @InjectModel(Notification.name)
    private readonly model: Model<Notification>,
  ) {}

  async create(entity: NotificationEntity) {
    const doc = new this.model(entity);
    return doc.save();
  }

  markRead(id: string) {
    return this.model.updateOne({ _id: id }, { $set: { read: true } }).exec();
  }

  findUnread(userId: string) {
    return this.model
      .find({ userId, read: false }, { _id: 1, text: 1, read: 1, inviteId: 1, createdAt: 1, requiresResponse: 1 })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  findById(id: string) {
    return this.model.findById(id).exec();
  }
}