import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Peer, PeerDocument } from '../models/peer.model';

@Injectable()
export class PeerRepo {
  constructor(@InjectModel(Peer.name) private readonly model: Model<PeerDocument>) {}

  async addPair(u1: string, u2: string) {
    await this.model.updateOne({ userId:u1, peerId:u2 }, {}, { upsert:true });
    await this.model.updateOne({ userId:u2, peerId:u1 }, {}, { upsert:true });
  }
  listPeers(userId: string) {
    return this.model.find({ userId }).lean().exec();
  }
}