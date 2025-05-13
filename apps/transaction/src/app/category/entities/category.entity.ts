// apps/transactions/src/app/categories/entities/category.entity.ts
import { IDomainEvent, ICategory, CategoryIcon, FlowType } from '@moneytracker/interfaces';

export class CategoryEntity implements ICategory {
  _id?: string;
  name: string;
  type: FlowType;
  icon: CategoryIcon;
  isDefault: boolean;
  userId?: string | null;
  deletedAt?: Date;

  // Список событий доменной модели
  events: IDomainEvent[] = [];

  constructor(data: Partial<ICategory>) {
    Object.assign(this, data);
  }

  // Отметить создание сущности
  markCreated(): this {
    this.events.push({ topic: 'category.created.event', data: { categoryId: this._id, userId: this.userId } });
    return this;
  }

  // Отметить обновление сущности
  markUpdated(): this {
    this.events.push({ topic: 'category.updated.event', data: { categoryId: this._id, userId: this.userId } });
    return this;
  }

  // Отметить удаление сущности
  markDeleted(): this {
    this.deletedAt = new Date();
    this.events.push({ topic: 'category.deleted.event', data: { categoryId: this._id, userId: this.userId } });
    return this;
  }
}
