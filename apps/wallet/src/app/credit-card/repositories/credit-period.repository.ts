import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreditPeriodDocument,
  CreditPeriodModel,
} from '../models/credit-period.model';
import { CreditPeriodEntity } from '../entities/credit-period.entity';

@Injectable()
export class CreditPeriodRepository {
  constructor(
    @InjectModel(CreditPeriodModel.name)
    private readonly model: Model<CreditPeriodDocument>,
  ) {}

  /** превращаем doc → entity */
  private toEntity(doc: CreditPeriodDocument): CreditPeriodEntity {
    const o = doc.toObject();
    return new CreditPeriodEntity({ ...o, _id: o._id.toString() });
  }

  async create(ent: CreditPeriodEntity): Promise<CreditPeriodEntity> {
    const saved = await new this.model(ent).save();
    return this.toEntity(saved);
  }

  async findOpenByAccount(accountId: string): Promise<CreditPeriodEntity | null> {
    const doc = await this.model
      .findOne({ accountId, status: { $in: ['open', 'payment'] }, deletedAt: null })
      .exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findById(id: string): Promise<CreditPeriodEntity | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async update(ent: CreditPeriodEntity): Promise<void> {
    const { _id, ...rest } = ent;
    await this.model.updateOne({ _id }, { $set: rest }).exec();
  }

  async softDelete(id: string, at = new Date()): Promise<void> {
    await this.model.updateOne({ _id: id }, { $set: { deletedAt: at } }).exec();
  }
}