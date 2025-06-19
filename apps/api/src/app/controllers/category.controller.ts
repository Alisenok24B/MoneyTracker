import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';
import {
  CategoryList,
  CategoryGet,
  CategoryCreate,
  CategoryUpdate,
  CategoryDelete,
} from '@moneytracker/contracts';
import { ListCategoriesDto } from '../dtos/list-categories.dto';
import { CategoryIdDto } from '../dtos/category-id.dto';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { PeersHelper } from '../helpers/peer.helper';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly rmqService: RMQService,
    private readonly peersHelper: PeersHelper,
  ) {}

  @UseGuards(JWTAuthGuard)
  @Get()
  async list(
    @UserId() userId: string,
    @Query() dto: ListCategoriesDto,
  ) {
    const peers = await this.peersHelper.getPeers(userId);
    const response = await this.rmqService.send<
      CategoryList.Request,
      CategoryList.Response
    >(CategoryList.topic, { userId, type: dto.type, peers });
    const categories = response.categories.map(cat => ({
      _id: cat._id,
      name: cat.name,
      type: cat.type,
      icon: cat.icon,
      isDefault: cat.isDefault,
    }));
    return { categories };
  }

  @UseGuards(JWTAuthGuard)
  @Get(':id')
  async get(
    @UserId() userId: string,
    @Param() params: CategoryIdDto,
  ) {
    const peers = await this.peersHelper.getPeers(userId);
    const response = await this.rmqService.send<
      CategoryGet.Request,
      CategoryGet.Response
    >(CategoryGet.topic, { userId, id: params.id, peers });
    const cat = response.category;
    // Оставляем только нужные поля, включая deletedAt
    const category = {
      _id: cat._id,
      name: cat.name,
      type: cat.type,
      icon: cat.icon,
      isDefault: cat.isDefault,
      deletedAt: cat.deletedAt ?? null,
    };
    return { category };
  }

  @UseGuards(JWTAuthGuard)
  @Post()
  async create(
    @UserId() userId: string,
    @Body() dto: CreateCategoryDto,
  ) {
    const peers = await this.peersHelper.getPeers(userId);
    await this.rmqService.send<
      CategoryCreate.Request,
      CategoryCreate.Response
    >(CategoryCreate.topic, { userId, peers: peers ?? [], ...dto });
    return { };
  }

  @UseGuards(JWTAuthGuard)
  @Patch(':id')
  async update(
    @UserId() userId: string,
    @Param() params: CategoryIdDto,
    @Body() dto: UpdateCategoryDto,
  ) {
    const peers = await this.peersHelper.getPeers(userId);
    await this.rmqService.send<
      CategoryUpdate.Request,
      CategoryUpdate.Response
    >(CategoryUpdate.topic, { userId, id: params.id, ...dto, peers });
    return {};
  }

  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  async delete(
    @UserId() userId: string,
    @Param() params: CategoryIdDto,
  ) {
    const peers = await this.peersHelper.getPeers(userId);
    await this.rmqService.send<
      CategoryDelete.Request,
      CategoryDelete.Response
    >(CategoryDelete.topic, { userId, id: params.id, peers });
    return {};
  }
}