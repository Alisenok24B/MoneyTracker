import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreditDetailsDocument } from '../models/credit-details.model';
import { CreditDetails } from '../entities/credit-details.vo';

@Injectable()
export class CreditRepository {
  constructor(
    @InjectModel('CreditDetails') private readonly model: Model<CreditDetailsDocument>,
  ) {}

  async create(accountId: string, vo: CreditDetails): Promise<CreditDetailsDocument> {
    const doc = new this.model({ accountId, ...vo });
    return doc.save();
  }

  async findByAccountId(
    accountId: string,
  ): Promise<CreditDetailsDocument | null> {
    return this.model
      .findOne({ accountId, deletedAt: null })
      .exec();
  }

  async updateLimit(accountId: string, limit: number): Promise<void> {
    await this.model.updateOne(
      { accountId },
      { $set: { creditLimit: limit } },
    ).exec();
  }

  async softDeleteByAccountId(accountId: string): Promise<any> {
    return this.model
      .updateOne(
        { accountId, deletedAt: null },
        { $set: { deletedAt: new Date() } },
      )
      .exec();
  }
}