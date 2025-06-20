// apps/transactions/src/app/categories/category.service.ts
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryEntity } from './entities/category.entity';
import { ICategory, FlowType } from '@moneytracker/interfaces';
import { CategoryEventEmitter } from './category.event-immiter';
import { RMQService } from 'nestjs-rmq';

@Injectable()
export class CategoryService {
  constructor(
    private readonly repo: CategoryRepository,
    private readonly events: CategoryEventEmitter,
    private readonly rmq: RMQService,
  ) {}

  /** владелец либо пользователь-peer */
  private isOwnerOrPeer(
    ownerId: string,
    userId: string,
    peers: string[],
  ): boolean {
    return ownerId === userId || peers.includes(ownerId);
  }

  /** Создание новой категории */
  async create(
    userId: string,
    dto: Pick<ICategory, 'name' | 'type' | 'icon'>,
    peers: string[]
  ): Promise<CategoryEntity> {
    const entity = new CategoryEntity({
      ...dto,
      isDefault: false,
      userId,
      deletedAt: null,
    }).markCreated();

    const savedDoc = await this.repo.create(entity as any);
    // Распакуем всё из savedDoc.toObject(), но _id приведём к строке
    const { _id, ...rest } = savedDoc.toObject();
    const created = new CategoryEntity({
      _id: _id.toString(),
      ...rest,
    });
    await this.events.emit(created.events);
    const userIds = [userId, ...(peers ?? [])];
    await this.rmq.notify('sync.peer.event', {
      userIds,
      type: 'category',
      action: 'create',
      data: {},
    });
    return created;
  }

  /** Список активных (не удалённых) категорий */
  async list(
    userId: string,
    peers: string[] = [],
    type?: FlowType,
  ): Promise<CategoryEntity[]> {
    const defs   = await this.repo.findDefaults(type);
    const customs  = await this.repo.findByUsers([userId, ...peers], type);

    return [...defs, ...customs].map(doc => {
      // doc — это POJO благодаря .lean(), просто ObjectId в _id
      const { _id, ...rest } = doc as any;
      return new CategoryEntity({
        _id: _id.toString(),
        ...rest,
      });
    });
  }

  /** Получение категории по ID (включая soft‑deleted) */
  async get(
    userId: string,
    id: string,
    peers: string[] = []
  ): Promise<CategoryEntity> {
    const doc = await this.repo.findById(id);
    if (!doc) {
      throw new NotFoundException('Category not found');
    }
    if (!doc.isDefault && ![userId, ...peers].includes(doc.userId?.toString())) {
      throw new ForbiddenException('Access denied');
    }

    const { _id, ...rest } = doc.toObject();
    return new CategoryEntity({
      _id: _id.toString(),
      ...rest,
    });
  }

/** Обновление категории */
  async update(
    userId: string,
    id: string,
    peers: string[] = [],
    dto: Partial<Pick<ICategory, 'name' | 'icon'>>,
  ): Promise<CategoryEntity> {
    const doc = await this.repo.findOne(id);
    if (!doc) {
      throw new NotFoundException('Category not found or already deleted');
    }
    if (doc.isDefault) {
      throw new ForbiddenException('Cannot modify default category');
    }
    if (
      !this.isOwnerOrPeer(
        doc.userId?.toString() || '',
        userId,
        peers
      )
    ) {
      throw new ForbiddenException('Access denied');
    }

    // приводим к any, чтобы TS не ругался
    const raw = doc.toObject() as any;
    // перезаписываем _id строкой
    raw._id = raw._id.toString();

    // создаём сущность и генерим событие
    const entity = new CategoryEntity(raw).markUpdated();
    Object.assign(entity, dto);

    // сохраняем изменения
    await this.repo.update(id, dto as any);

    // обновляем документ в БД и снова «ловим» новые поля
    const updatedDoc = await this.repo.findOne(id)!;
    const updatedRaw = updatedDoc.toObject() as any;
    updatedRaw._id = updatedRaw._id.toString();

    // формируем результат
    const updated = new CategoryEntity(updatedRaw);
    await this.events.emit(entity.events);
    const userIds = [userId, ...(peers ?? [])];
    await this.rmq.notify('sync.peer.event', {
      userIds,
      type: 'category',
      action: 'update',
      data: {},
    });
    return updated;
  }

  /** Мягкое удаление категории */
  async delete(
    userId: string,
    id: string,
    peers: string[] = [], 
  ): Promise<void> {
    const doc = await this.repo.findOne(id);
    if (!doc) {
      throw new NotFoundException('Category not found or already deleted');
    }
    if (doc.isDefault) {
      throw new ForbiddenException('Cannot delete default category');
    }
    if (
      !this.isOwnerOrPeer(
        doc.userId?.toString() || '',
        userId,
        peers
      )
    ) {
      throw new ForbiddenException('Access denied');
    }

    // Приводим результат toObject к any и явно строковым _id
    const raw = doc.toObject() as any;
    raw._id = raw._id.toString();

    // Создаём доменную сущность с накоплением событий
    const entity = new CategoryEntity(raw).markDeleted();

    // Мягко удаляем
    await this.repo.softDelete(id);

    // Эмитим события
    await this.events.emit(entity.events);
    const userIds = [userId, ...(peers ?? [])];
    await this.rmq.notify('sync.peer.event', {
      userIds,
      type: 'category',
      action: 'delete',
      data: {},
    });
  }
}