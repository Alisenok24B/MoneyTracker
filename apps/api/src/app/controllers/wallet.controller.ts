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
  ForbiddenException,
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
  AccountUserInfo,
} from '@moneytracker/contracts';

import { CreateAccountDto } from '../dtos/create-account.dto';
import { UpdateAccountDto } from '../dtos/update-account.dto';
import { ListAccountsDto } from '../dtos/list-accounts.dto';
import { AccountIdDto } from '../dtos/account-id.dto';
import { AccountType } from '@moneytracker/interfaces';
import { PeersHelper } from '../helpers/peer.helper';

@Controller('accounts')
export class WalletController {
  constructor(
    private readonly rmqService: RMQService,
    private readonly peersHelper: PeersHelper
  ) {}

  // 1) Получить список счетов (своих и peers), возвращаем только нужные поля
  @UseGuards(JWTAuthGuard)
  @Get()
  async list(
    @UserId() userId: string,
    @Query() dto: ListAccountsDto,
  ) {
    // 1.1) достаём ID peers
    const peers = await this.peersHelper.getPeers(userId);

    // 1.2) получаем все счета (own + peers)
    const { accounts } = await this.rmqService.send<
      AccountList.Request,
      AccountList.Response
    >(AccountList.topic, { userId, peers });

    // 1.3) для каждого счета собираем базу и — если owner ≠ текущего — добираем имя и id владельца
    const result = await Promise.all(
      accounts.map(async acc => {
        const { _id, name, type, balance, currency, creditDetails, userId: ownerId } = acc;
        const base: any = { _id, name, type, balance, currency };
        if (type === AccountType.CreditCard) {
          base.creditDetails = creditDetails;
        }
        // чужой счет — добавляем owner
        if (ownerId !== userId) {
          const { profile } = await this.rmqService.send<
            AccountUserInfo.Request,
            AccountUserInfo.Response
          >(AccountUserInfo.topic, { id: ownerId });
          base.owner = { id: ownerId, name: profile.displayName };
        }
        return base;
      })
    );

    return { accounts: result };
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

  // 3) Получить один счет по ID, + owner если не свой
  @UseGuards(JWTAuthGuard)
  @Get(':id')
  async getById(
    @UserId() userId: string,
    @Param() params: AccountIdDto,
  ) {
    const peers = await this.peersHelper.getPeers(userId);
    const { account } = await this.rmqService.send<
      AccountGet.Request,
      AccountGet.Response
    >(AccountGet.topic, { userId, id: params.id, peers });
    const { _id, name, type, balance, currency, creditDetails, userId: ownerId } = account;

    const base: any = { _id, name, type, balance, currency };
    if (type === AccountType.CreditCard) {
      base.creditDetails = creditDetails;
    }
    // чужой — добавляем владельца
    if (ownerId !== userId) {
      const { profile } = await this.rmqService.send<
        AccountUserInfo.Request,
        AccountUserInfo.Response
      >(AccountUserInfo.topic, { id: ownerId });
      base.owner = { id: ownerId, name: profile.displayName };
    }

    return { account: base };
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