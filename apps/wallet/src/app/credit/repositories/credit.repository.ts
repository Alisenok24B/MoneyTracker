import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreditPeriod, CreditPeriodDocument } from '../models/credit-period.model';

@Injectable()
export class CreditRepository {
  constructor(
    @InjectModel(CreditPeriod.name) private readonly repo: Model<CreditPeriodDocument>
  ) {}

  async create(period: Partial<CreditPeriod>): Promise<CreditPeriod> {
    const doc = new this.repo(period);
    return doc.save();
  }

  async findCurrent(accountId: string): Promise<CreditPeriod | null> {
    return this.repo.findOne({ accountId, status: { $in: ['open', 'due'] } }).exec();
  }

  async updateStatus(id: string, status: 'due' | 'overdue'): Promise<any> {
    return this.repo.updateOne({ _id: id }, { status }).exec();
  }

   /** Вставить или обновить один период */
  async upsertPeriod(accountId: string, data: Partial<CreditPeriod> & { status: 'open'|'due'|'overdue' }) {
    return this.repo.updateOne(
      { accountId },
      { $set: data },
      { upsert: true },
    ).exec();
  }
}
