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
  BadRequestException,
} from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';

import {
  AccountCreate,
  AccountList,
  AccountGet,
  AccountUpdate,
  AccountDelete,
} from '@moneytracker/contracts';

import { CreateAccountDto } from '../dtos/create-account.dto';
import { UpdateAccountDto } from '../dtos/update-account.dto';
import { ListAccountsDto } from '../dtos/list-accounts.dto';
import { AccountIdDto } from '../dtos/account-id.dto';
import { AccountType } from '@moneytracker/interfaces';

@Controller('accounts')
export class WalletController {
  constructor(private readonly rmqService: RMQService) {}

  // 1) Получить список счетов (своих и peers), возвращаем только нужные поля
  @UseGuards(JWTAuthGuard)
  @Get()
  async list(
    @UserId() userId: string,
    @Query() dto: ListAccountsDto,
  ) {
    const response = await this.rmqService.send<
      AccountList.Request,
      AccountList.Response
    >(AccountList.topic, { userId, peers: dto.peers || [] });

    const sanitized = response.accounts.map(account => {
      const { _id, name, type, balance, currency, creditDetails } = account;
      if (type === AccountType.CreditCard) {
        return { _id, name, type, balance, currency, creditDetails };
      }
      return { _id, name, type, balance, currency };
    });

    return { accounts: sanitized };
  }

  // 2) Создать новый счет
  @UseGuards(JWTAuthGuard)
  @Post()
  async create(
    @UserId() userId: string,
    @Body() dto: CreateAccountDto,
  ) {
    // balance обязателен для не-кредитных
    if (dto.type !== AccountType.CreditCard && dto.balance === undefined) {
      throw new BadRequestException('balance is required for non-credit accounts');
    }
    // creditDetails обязательны для creditCard и запрещены для остальных
    if (dto.type === AccountType.CreditCard && !dto.creditDetails) {
      throw new BadRequestException('For creditCard must to write creditDetails');
    }
    if (dto.creditDetails && dto.type !== AccountType.CreditCard) {
      throw new BadRequestException('creditDetails are only allowed for creditCard accounts');
    }

    return this.rmqService.send<AccountCreate.Request, AccountCreate.Response>(
      AccountCreate.topic,
      { userId, ...dto },
    );
  }

  // 3) Получить один счет по ID, возвращая только определённые поля
  @UseGuards(JWTAuthGuard)
  @Get(':id')
  async getById(
    @UserId() userId: string,
    @Param() params: AccountIdDto,
  ) {
    const response = await this.rmqService.send<
      AccountGet.Request,
      AccountGet.Response
    >(AccountGet.topic, { userId, id: params.id });
    const { account } = response;
    const { _id, name, type, balance, currency, creditDetails } = account;
    if (type === AccountType.CreditCard) {
      return { account: { _id, name, type, balance, currency, creditDetails } };
    }
    return { account: { _id, name, type, balance, currency } };
  }

  // 4) Обновить счет по ID
  @UseGuards(JWTAuthGuard)
  @Patch(':id')
  async update(
    @UserId() userId: string,
    @Param() params: AccountIdDto,
    @Body() dto: UpdateAccountDto,
  ) {
    return this.rmqService.send<
      AccountUpdate.Request,
      AccountUpdate.Response
    >(AccountUpdate.topic, {
      userId,
      id: params.id,
      ...dto,
    });
  }

  // 5) Удалить счет (soft-delete) по ID
  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  async delete(
    @UserId() userId: string,
    @Param() params: AccountIdDto,
  ) {
    return this.rmqService.send<
      AccountDelete.Request,
      AccountDelete.Response
    >(AccountDelete.topic, {
      userId,
      id: params.id,
    });
  }
}