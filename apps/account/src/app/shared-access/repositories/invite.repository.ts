import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invite, InviteDocument } from '../models/invite.model';

@Injectable()
export class InviteRepo {
  constructor(@InjectModel(Invite.name) private readonly model: Model<InviteDocument>) {}

  create(from: string, to: string) {
    return new this.model({ fromUserId: from, toUserId: to }).save();
  }
  findById(id: string)         { return this.model.findById(id).exec(); }
  setAccepted(id: string)      { return this.model.updateOne({ _id:id }, { $set:{ status:'accepted' }}).exec(); }
}