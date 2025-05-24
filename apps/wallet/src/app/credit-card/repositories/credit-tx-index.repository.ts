import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreditTxIndex,
  CreditTxIndexDocument,
} from '../models/credit-tx-index.model';

@Injectable()
export class CreditTxIndexRepository {
  constructor(
    @InjectModel(CreditTxIndex.name)
    private readonly model: Model<CreditTxIndexDocument>,
  ) {}

  async create(idx: Omit<CreditTxIndex, '_id'>) {
    await new this.model(idx).save();
  }

  async findByTxId(txId: string): Promise<CreditTxIndex | null> {
    const doc = await this.model.findOne({ txId }).lean().exec();
    return doc ?? null;
  }

  async update(txId: string, patch: Partial<CreditTxIndex>) {
    await this.model.updateOne({ txId }, { $set: patch }).exec();
  }

  async delete(txId: string) {
    await this.model.deleteOne({ txId }).exec();
  }
}