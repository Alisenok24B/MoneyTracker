import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './models/category.model';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryService } from './category.service';
import { CategoryCommands } from './category.commands';
import { CategoryQueries } from './category.queries';
import { CategoryEventEmitter } from './category.event-immiter';
import { CategorySeeder } from './category.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
  ],
  providers: [CategoryRepository, CategoryService, CategoryEventEmitter, CategorySeeder],
  controllers: [CategoryCommands, CategoryQueries],
  exports: [CategoryService],
})
export class CategoryModule {}