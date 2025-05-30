import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types } from 'mongoose';
import { CreditPeriodModel, CreditPeriodDocument } from '../models/credit-period.model';
import { CreditPeriodEntity } from '../entities/credit-period.entity';

type FindManyFilter = {
  status?: 'open' | 'payment' | 'overdue';
  statementEndLt?: Date;
  paymentDueLt?: Date;
  accountId?: string;
};

@Injectable()
export class CreditPeriodRepository {
  constructor(
    @InjectModel(CreditPeriodModel.name)
    private readonly model: Model<CreditPeriodDocument>,
  ) {}

  /* ---------------- helpers ---------------- */
  private toEntity(doc: CreditPeriodDocument): CreditPeriodEntity {
    const o = doc.toObject();
    return new CreditPeriodEntity({ ...o, _id: o._id.toString() });
  }

  /* ---------------- CRUD ------------------- */
  async create(ent: CreditPeriodEntity) {
    const saved = await new this.model(ent).save();
    return this.toEntity(saved);
  }

  async update(ent: CreditPeriodEntity) {
    const { _id, ...rest } = ent;
    await this.model.updateOne({ _id: new Types.ObjectId(_id) }, { $set: rest }).exec();
  }

  async findById(id: string) {
    const doc = await this.model.findById(id).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findOpenByAccount(acc: string) {
    const d = await this.model
      .findOne({ accountId: acc, status: { $in: ['open'] }, deletedAt: null })
      .exec();
    return d ? this.toEntity(d) : null;
  }

  async findByDate(accountId: string, date: Date): Promise<CreditPeriodEntity | null> {
    const doc = await this.model
      .findOne({
        accountId,
        statementStart: { $lte: date },
        statementEnd:   { $gte: date },
      })
      .exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findAllOpen() {
    const docs = await this.model
      .find({ deletedAt: null, status: { $in: ['open','payment','overdue'] } })
      .exec();
    return docs.map(d => this.toEntity(d));
  }

  async findMany(f: FindManyFilter) {
    const q: FilterQuery<CreditPeriodDocument> = { deletedAt: null };
    if (f.status)          q.status       = f.status;
    if (f.accountId)       q.accountId    = f.accountId;
    if (f.statementEndLt)  q.statementEnd = { $lt: f.statementEndLt };
    if (f.paymentDueLt)    q.paymentDue   = { $lt: f.paymentDueLt };

    const docs = await this.model.find(q).lean().exec();
    return docs.map(d => new CreditPeriodEntity({ ...d, _id: d._id.toString() }));
  }
}