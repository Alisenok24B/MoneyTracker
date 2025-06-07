import { Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  CategoryList,
  CategoryGet,
  CategoryCreate,
  CategoryUpdate,
  CategoryDelete,
} from '@moneytracker/contracts';
import { CategoryService } from './category.service';

@Controller()
export class CategoryCommands {
  constructor(private readonly service: CategoryService) {}

  @RMQValidate()
  @RMQRoute(CategoryCreate.topic)
  async create({ userId, name, type, icon }: CategoryCreate.Request): Promise<CategoryCreate.Response> {
    const category = await this.service.create(userId, { name, type, icon });
    return { category };
  }

  @RMQValidate()
  @RMQRoute(CategoryUpdate.topic)
  async update({ userId, id, name, icon, peers }: CategoryUpdate.Request): Promise<CategoryUpdate.Response> {
    await this.service.update(userId, id, peers ?? [], { name, icon });
    return {};
  }

  @RMQValidate()
  @RMQRoute(CategoryDelete.topic)
  async delete({ userId, id, peers }: CategoryDelete.Request): Promise<CategoryDelete.Response> {
    await this.service.delete(userId, id, peers ?? []);
    return {};
  }
}