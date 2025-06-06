// apps/account/src/app/shared-access/repositories/peer.repository.ts
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger }  from '@nestjs/common';
import { Model, Types }       from 'mongoose';
import { Peer, PeerLinkDocument } from '../models/peer.model';

@Injectable()
export class PeerRepo {
  private log = new Logger(PeerRepo.name);
  constructor(
    @InjectModel(Peer.name) private readonly model: Model<PeerLinkDocument>,
  ) {}

  /** Нормализуем пару: сортируем, чтобы ['a','b'] === ['b','a']  */
  private static normalize(u1: string, u2: string): [string, string] {
    return u1 < u2 ? [u1, u2] : [u2, u1];
  }

  /** Создать (или гарантировать наличие) единственной записи связи */
  async ensurePair(u1: string, u2: string): Promise<void> {
    const members = PeerRepo.normalize(u1, u2);
    await this.model.updateOne(
      { members },        // фильтр по массиву
      { $setOnInsert: { members } },
      { upsert: true },
    ).exec();
  }

  /** Проверка существования пары */
  async existsPair(u1: string, u2: string): Promise<boolean> {
    const members = PeerRepo.normalize(u1, u2);
    return !!(await this.model.findOne({ members }).lean().exec());
  }

  /** Список peer-id для пользователя */
  async listPeers(userId: string): Promise<string[]> {
    const docs = await this.model
      .find({ members: userId })
      .lean()
      .exec();

    // из каждой пары убираем сам userId → остаётся peer
    return docs.map(d => (d.members[0] === userId ? d.members[1] : d.members[0]));
  }

  /** Удалить пару */
  async removePair(u1: string, u2: string): Promise<void> {
    const members = [u1, u2].sort();
    await this.model.deleteOne({ members }).exec();
  }
}