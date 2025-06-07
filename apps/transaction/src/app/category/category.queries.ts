import { Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { CategoryList, CategoryGet } from '@moneytracker/contracts';
import { CategoryService } from './category.service';

@Controller()
export class CategoryQueries {
  constructor(private readonly service: CategoryService) {}

  @RMQValidate()
  @RMQRoute(CategoryList.topic)
  async list({ userId, type, peers }: CategoryList.Request): Promise<CategoryList.Response> {
    const categories = await this.service.list(userId, peers ?? [], type);
    return { categories };
  }

  @RMQValidate()
  @RMQRoute(CategoryGet.topic)
  async get({ userId, id, peers }: CategoryGet.Request): Promise<CategoryGet.Response> {
    const category = await this.service.get(userId, id, peers ?? []);
    return { category };
  }
}