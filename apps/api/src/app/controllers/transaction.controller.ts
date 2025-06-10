import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Query,
    Body,
    UseGuards,
    Logger,
  } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';
import { pick } from 'lodash';
import {
  TransactionCreate,
  TransactionList,
  TransactionGet,
  TransactionUpdate,
  TransactionDelete,
  AccountUserInfo,
  AccountGet,
  CategoryGet,
  TransactionPurge,
  AccountList,
  TransactionSummary,
} from '@moneytracker/contracts';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { ListTransactionsDto } from '../dtos/list-transactions.dto';
import { TransactionIdDto } from '../dtos/transaction-id.dto';
import { UpdateTransactionDto } from '../dtos/update-transaction.dto';
import { PeersHelper } from '../helpers/peer.helper';
import { TxSummaryDto } from '../dtos/tx-summary.dto';

function isoDateOnly(d: Date | string): string {
  return new Date(d).toISOString().split('T')[0];
}

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly rmq: RMQService,
    private readonly peersHelper: PeersHelper
  ) {}
  private readonly logger = new Logger(TransactionController.name);

  @UseGuards(JWTAuthGuard)
  @Post()
  async create(
    @UserId() userId: string,
    @Body() dto: CreateTransactionDto,
  ) {
    const peers = await this.peersHelper.getPeers(userId);
    await this.rmq.send<
      TransactionCreate.Request,
      TransactionCreate.Response
    >(
      TransactionCreate.topic,
      {
        userId,
        ...dto,
        date: new Date(dto.date),
        peers
      },
    );
    return {};
  }

  @UseGuards(JWTAuthGuard)
  @Get()
  async list(@UserId() userId: string, @Query() dto: ListTransactionsDto) {
    const peers = await this.peersHelper.getPeers(userId);
    this.logger.log(`peers = ${peers}`);
    this.logger.log(`Я ДТО: ${dto.accountIds}`)
    /* Список всех доступных счетов */
    const { accounts } = await this.rmq.send<
      AccountList.Request,
      AccountList.Response
    >(AccountList.topic, { userId, peers });

    const accById = new Map(
      accounts.map(a => [a._id.toString(), a]),
    );

    /* берем транзакции */
    const { transactions: flat } = await this.rmq.send<
      TransactionList.Request,
      TransactionList.Response
    >(TransactionList.topic, {
      userId,
      peers,
      /* фильтры из query-строки */
      accountIds: dto.accountIds,
      userIds: dto.userIds,
      categoryIds: dto.categoryIds,
      type: dto.type,
      date: dto.date ? new Date(dto.date) : undefined,
      month: dto.month,
      year: dto.year,
      from: dto.from ? new Date(dto.from) : undefined,
      to: dto.to ? new Date(dto.to) : undefined,
    });

    /* обогащаем данными, используя map счётов */
    const enriched = await Promise.all(
      flat.map(async tx => {
        // общие данные: пользователь и категория
        const [userRes, catRes] = await Promise.all([
          this.rmq.send<AccountUserInfo.Request, AccountUserInfo.Response>(
            AccountUserInfo.topic,
            { id: tx.userId },
          ),
          this.rmq.send<CategoryGet.Request, CategoryGet.Response>(
            CategoryGet.topic,
            { userId, id: tx.categoryId, peers },
          ),
        ]);

        const baseFields = {
          _id:     tx._id,
          amount:  tx.amount,
          date: isoDateOnly(tx.date),
          type:    tx.type,
          description: tx.description,
          periodId: tx.periodId,
          hasInterest: tx.hasInterest,
          user: {
            id:   tx.userId,
            name: userRes?.profile?.displayName ?? null,
          },
          category: {
            id:   catRes.category._id,
            name: catRes.category.name,
          },
        };

        //----------------------------------------------------------------
        if (tx.type === 'transfer') {
          /* данные счетов */
          const fromAcc = accById.get(tx.accountId)!;
          const toAcc   = accById.get(tx.toAccountId!)!;

          /* владелец исходного счёта */
          const fromOwner =
          fromAcc.userId === userId
            ? undefined
            : {
              id  : fromAcc.userId,
              name: (await this.rmq.send<
                  AccountUserInfo.Request, AccountUserInfo.Response
                >(AccountUserInfo.topic, { id: fromAcc.userId })
              ).profile.displayName };

          /* владелец приёмного счёта */
          const toOwner =
          toAcc.userId === userId
            ? undefined
            : { 
              id  : toAcc.userId,
              name: (await this.rmq.send<
                  AccountUserInfo.Request, AccountUserInfo.Response
                >(AccountUserInfo.topic, { id: toAcc.userId })
              ).profile.displayName };

          return {
            ...baseFields,
            fromAccount: {
              ...pick(fromAcc, ['name', 'type', 'currency']),
              owner: fromOwner
            },
            toAccount  : {
              ...pick(toAcc, ['name', 'type', 'currency']),
              owner: toOwner,
            },
          };
        }
        //----------------------------------------------------------------

        /* income | expense */
        const acc = accById.get(tx.accountId)!;
        return {
          ...baseFields,
          account: pick(acc, ['name', 'type', 'currency']),
        };
      }),
    );

    return { transactions: enriched };
  }
  
  @UseGuards(JWTAuthGuard)
  @Get(':id')
  async get(@UserId() userId: string, @Param() params: TransactionIdDto) {
    const peers = await this.peersHelper.getPeers(userId);

    /* список счетов */
    const { accounts } = await this.rmq.send<
      AccountList.Request,
      AccountList.Response
    >(AccountList.topic, { userId, peers });
    const accById = new Map(accounts.map(a => [a._id.toString(), a]));
    
    /* сама транзакция */
    const { transaction: tx } = await this.rmq.send<
      TransactionGet.Request,
      TransactionGet.Response
    >(TransactionGet.topic, {
      userId,
      id: params.id,
      peers
    });

    /* --- общие данные пользователя и категории -------------------- */
    const [userRes, catRes] = await Promise.all([
      this.rmq.send<AccountUserInfo.Request, AccountUserInfo.Response>(
        AccountUserInfo.topic, { id: tx.userId },
      ),
      this.rmq.send<CategoryGet.Request, CategoryGet.Response>(
        CategoryGet.topic, { userId, id: tx.categoryId, peers },
      ),
    ]);

    const base = {
      _id: tx._id,
      type: tx.type,
      amount: tx.amount,
      date: isoDateOnly(tx.date),
      description: tx.description,
      periodId: tx.periodId,
      hasInterest: tx.hasInterest, 
      deletedAt: tx.deletedAt ?? null,
      user: {
        id:   tx.userId,
        name: userRes?.profile?.displayName ?? null,
      },
      category: {
        id:   catRes.category._id,
        name: catRes.category.name,
      },
    };

    /* -------------------------------------------------------------- */
    if (tx.type === 'transfer') {
      const fromAcc = accById.get(tx.accountId)!;
      const toAcc   = accById.get(tx.toAccountId!)!;

      const fromOwner =
        fromAcc.userId === userId
          ? undefined
          : { 
            id  : fromAcc.userId,
            name: (await this.rmq.send<
                AccountUserInfo.Request, AccountUserInfo.Response
              >(AccountUserInfo.topic, { id: fromAcc.userId })
            ).profile.displayName };

      const toOwner =
        toAcc.userId === userId
          ? undefined
          : { 
            id  : toAcc.userId,
            name: (await this.rmq.send<
                AccountUserInfo.Request, AccountUserInfo.Response
              >(AccountUserInfo.topic, { id: toAcc.userId })
            ).profile.displayName };

      return {
        transaction: {
          ...base,
          fromAccount: {
            ...pick(fromAcc, ['name', 'type', 'currency']),
            owner: fromOwner
          },
          toAccount  : {
            ...pick(toAcc, ['name', 'type', 'currency']),
            owner: toOwner,
          },
        },
      };
    }
      
    /* income / expense */
    const acc = accById.get(tx.accountId)!;

    return {
      transaction: {
        ...base,
        account: pick(acc, ['name', 'type', 'currency']),
      },
    };
  }

  @UseGuards(JWTAuthGuard)
  @Patch(':id')
  async update(
    @UserId() userId: string,
    @Param() params: TransactionIdDto,
    @Body() dto: UpdateTransactionDto,
  ) {
    const { date, ...rest } = dto;
    await this.rmq.send<
      TransactionUpdate.Request,
      TransactionUpdate.Response
    >(
      TransactionUpdate.topic,
      {
        userId,
        id: params.id,
        ...rest,
        ...(date ? { date: new Date(date) } : {}),
      },
    );
    return {};
  }

  // @UseGuards(JWTAuthGuard)
  // @Delete(':id')
  // async delete(
  //   @UserId() userId: string,
  //   @Param() params: TransactionIdDto,
  // ) {
  //   await this.rmq.send<
  //     TransactionDelete.Request,
  //     TransactionDelete.Response
  //   >(
  //     TransactionDelete.topic,
  //     {
  //       userId,
  //       id: params.id,
  //     },
  //   );
  //   return {};
  // }

  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  async purge(
    @UserId() userId: string,
    @Param() params: TransactionIdDto,
  ) {
    const peers = await this.peersHelper.getPeers(userId);
    this.logger.log(`peers=${peers}`);
    await this.rmq.send<
      TransactionPurge.Request,
      TransactionPurge.Response
    >(
      TransactionPurge.topic,
      {
        userId,
        id: params.id,
        peers
      },
    );
    return {};
  }

  /** POST /transactions/summary */
  @UseGuards(JWTAuthGuard)
  @Post('summary')
  async summary(
    @UserId() userId: string,
    @Body() dto: TxSummaryDto,
  ) {
    const peers = await this.peersHelper.getPeers(userId);

    const { total, breakdown } = await this.rmq.send<
      TransactionSummary.Request,
      TransactionSummary.Response
    >(TransactionSummary.topic, {
      userId,
      peers,
      accountIds: dto.accountIds,
      type: dto.type,
      from: dto.from,
      to: dto.to,
    });

    return { total, breakdown };
  }
}
