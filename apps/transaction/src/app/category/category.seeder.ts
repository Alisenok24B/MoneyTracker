import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CategoryRepository } from './repositories/category.repository';
import { DEFAULT_CATEGORIES } from './default-categories';

@Injectable()
export class CategorySeeder implements OnModuleInit {
  private readonly logger = new Logger(CategorySeeder.name);

  constructor(private readonly repo: CategoryRepository) {}

  async onModuleInit() {
    this.logger.log('Checking default categories...');
    for (const def of DEFAULT_CATEGORIES) {
      const already = await this.repo.exists({
        name: def.name,
        type: def.type,
        isDefault: true,
        deletedAt: null,
      });
      if (!already) {
        await this.repo.create({
          name: def.name,
          type: def.type,
          icon: def.icon,
          isDefault: true,
          userId: null,
          deletedAt: null,
        } as any);
        this.logger.log(`Inserted default category "${def.name}"`);
      }
    }
    this.logger.log('Default categories are up to date.');
  }
}