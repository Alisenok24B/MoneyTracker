import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountDocument } from '../models/account.model';
import { AccountEntity } from '../entities/account.entity';

@Injectable()
export class AccountRepository {
  constructor(@InjectModel('Account') private readonly accountModel: Model<AccountDocument>) {}

  async create(account: Partial<AccountEntity>): Promise<AccountDocument> {
    const created = new this.accountModel(account);
    return created.save();
  }

  async findByUsers(userIds: string[]): Promise<AccountDocument[]> {
    return this.accountModel
      .find({ userId: { $in: userIds }, deletedAt: null })
      .exec();
  }

  async findById(id: string): Promise<AccountDocument | null> {
    return this.accountModel.findOne({ _id: id, deletedAt: null }).exec();
  }

  /** Поиск по ID без учёта deletedAt */
  async findByIdIncludeDeleted(id: string): Promise<AccountDocument | null> {
    return this.accountModel.findById(id).exec();
  }

  async update(id: string, update: Partial<AccountEntity>): Promise<any> {
    return this.accountModel.updateOne({ _id: id }, { $set: update }).exec();
  }

  async softDelete(id: string, deletedAt: Date): Promise<any> {
    return this.accountModel
      .updateOne({ _id: id }, { $set: { deletedAt } })
      .exec();
  }
}