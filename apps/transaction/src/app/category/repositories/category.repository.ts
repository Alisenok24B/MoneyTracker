import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../models/category.model';
import { CategoryEntity } from '../entities/category.entity';
import { FlowType } from '@moneytracker/interfaces';

@Injectable()
export class CategoryRepository {
  constructor(@InjectModel(Category.name) private readonly model: Model<Category>) {}

  async findDefaults(type?: FlowType) {
    const filter: any = { isDefault: true, deletedAt: null };
    if (type) filter.type = type;
    return this.model.find(filter).lean().exec();
  }

  async findByUser(userId: string, type?: FlowType) {
    const filter: any = { userId, deletedAt: null };
    if (type) filter.type = type;
    return this.model.find(filter).lean().exec();
  }

  async findOne(id: string) {
    return this.model.findOne({ _id: id, deletedAt: null }).exec();
  }

  async findById(id: string) {
    return this.model.findById(id).exec();
  }

  findByUsers(userIds: string[], type?: FlowType)  { 
    const query: any = {
      userId: { $in: userIds },
      deletedAt: null,            // ← только активные
    };
    if (type) {
      query.type = type;          // ← фильтр по доход / расход / перевод
    }
    return this.model.find(query).lean().exec();
  }

  async create(entity: CategoryEntity) {
    const doc = new this.model(entity);
    return doc.save();
  }

  async update(id: string, update: Partial<CategoryEntity>) {
    return this.model.updateOne({ _id: id, deletedAt: null }, { $set: update }).exec();
  }

  async softDelete(id: string) {
    return this.model.updateOne(
      { _id: id, deletedAt: null },
      { $set: { deletedAt: new Date() } }
    ).exec();
  }

  async exists(filter: Partial<Record<keyof Category, any>>): Promise<boolean> {
    const res = await this.model.exists(filter);
    return !!res;
  }
}