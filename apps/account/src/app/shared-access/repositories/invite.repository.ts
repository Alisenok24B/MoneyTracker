import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model }       from 'mongoose';
import { Invite, InviteDocument } from '../models/invite.model';
import { InviteEntity }           from '../entities/invite.entity';

@Injectable()
export class InviteRepo {
  constructor(
    @InjectModel(Invite.name)
    private readonly model: Model<InviteDocument>,
  ) {}

  /* CREATE ----------------------------------------------------------- */
  async create(entity: InviteEntity) {
    const doc = new this.model(entity);
    return doc.save();
  }

  /* READ ------------------------------------------------------------- */
  findById(id: string) {
    return this.model.findById(id).exec();
  }

  /* UPDATE ----------------------------------------------------------- */
  setAccepted(id: string) {
    return this.model.updateOne({ _id: id }, { $set: { status: 'accepted' } }).exec();
  }
  setRejected(id: string) {
    return this.model.updateOne({ _id: id }, { $set: { status: 'rejected' } }).exec();
  }
  /** произвольный patch (нужно, чтобы записать notificationId) */
  update(id: string, patch: Partial<InviteEntity>) {
    return this.model.updateOne({ _id: id }, { $set: patch }).exec();
  }

  /** Проверить, есть ли pending-инвайт между пользователями */
  async findPending(fromUserId: string, toUserId: string): Promise<InviteDocument | null> {
    return this.model.findOne({
      fromUserId,
      toUserId,
      status: 'pending',
    }).exec();
  }
}