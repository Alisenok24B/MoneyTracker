import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invite, InviteDocument } from '../models/invite.model';

@Injectable()
export class InviteRepo {
  constructor(
    @InjectModel(Invite.name)
    private readonly model: Model<InviteDocument>,
  ) {}

  /** Создаём приглашение */
  create(fromUserId: string, toUserId: string) {
    return new this.model({ fromUserId, toUserId }).save();
  }

  /** Получить по id */
  findById(id: string) {
    return this.model.findById(id).exec();
  }

  /** Принять приглашение */
  setAccepted(id: string) {
    return this.model
      .updateOne({ _id: id }, { $set: { status: 'accepted' } })
      .exec();
  }

  /** Отклонить приглашение – НОВЫЙ метод */
  setRejected(id: string) {
    return this.model
      .updateOne({ _id: id }, { $set: { status: 'rejected' } })
      .exec();
  }

  update(id: string, patch: Partial<Invite>) {
    return this.model.updateOne({ _id: id }, { $set: patch }).exec();
  }
}