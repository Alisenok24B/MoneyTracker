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
} from '@moneytracker/contracts';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { ListTransactionsDto } from '../dtos/list-transactions.dto';
import { TransactionIdDto } from '../dtos/transaction-id.dto';
import { UpdateTransactionDto } from '../dtos/update-transaction.dto';

function isoDateOnly(d: Date | string): string {
  return new Date(d).toISOString().split('T')[0];
}

@Controller('transactions')
export class TransactionController {
  constructor(private readonly rmq: RMQService) {}

  @UseGuards(JWTAuthGuard)
  @Post()
  async create(
    @UserId() userId: string,
    @Body() dto: CreateTransactionDto,
  ) {
    await this.rmq.send<
      TransactionCreate.Request,
      TransactionCreate.Response
    >(
      TransactionCreate.topic,
      {
        userId,
        ...dto,
        date: new Date(dto.date),
      },
    );
    return {};
  }

  @UseGuards(JWTAuthGuard)
  @Get()
  async list(@UserId() userId: string, @Query() dto: ListTransactionsDto) {
    const { transactions: flat } = await this.rmq.send<
      TransactionList.Request,
      TransactionList.Response
    >(TransactionList.topic, {
      userId,
      peers: dto.peers ?? [],
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

    const enriched = await Promise.all(
      flat.map(async tx => {
        // --- общие данные: пользователь и категория -----------------
        const [userRes, catRes] = await Promise.all([
          this.rmq.send<AccountUserInfo.Request, AccountUserInfo.Response>(
            AccountUserInfo.topic,
            { id: tx.userId },
          ),
          this.rmq.send<CategoryGet.Request, CategoryGet.Response>(
            CategoryGet.topic,
            { userId, id: tx.categoryId },
          ),
        ]);

        const baseFields = {
          _id:     tx._id,
          amount:  tx.amount,
          date: isoDateOnly(tx.date),
          type:    tx.type,
          description: tx.description,
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
          const [fromAccRes, toAccRes] = await Promise.all([
            this.rmq.send<AccountGet.Request, AccountGet.Response>(
              AccountGet.topic, { userId, id: tx.accountId },
            ),
            this.rmq.send<AccountGet.Request, AccountGet.Response>(
              AccountGet.topic, { userId, id: tx.toAccountId! },
            ),
          ]);

          const toOwnerId = toAccRes.account.userId;
          let toOwner: { name: string } | undefined;
          if (toOwnerId !== userId) {
            const ownerRes = await this.rmq.send<
              AccountUserInfo.Request,
              AccountUserInfo.Response
            >(AccountUserInfo.topic, { id: toOwnerId });
            toOwner = { name: ownerRes.profile.displayName };
          }

          return {
            ...baseFields,
            fromAccount: pick(
              fromAccRes.account,
              ['name', 'type', 'currency'],
            ),
            toAccount: {
              ...pick(
                toAccRes.account,
                ['name', 'type', 'currency'],
              ),
              owner: toOwner,
            },
          };
        }
        //----------------------------------------------------------------

        /* income | expense */
        const accRes = await this.rmq.send<AccountGet.Request, AccountGet.Response>(
          AccountGet.topic,
          { userId, id: tx.accountId },
        );

        return {
          ...baseFields,
          account: pick(
            accRes.account,
            ['name', 'type', 'currency'],
          ),
        };
      }),
    );

    return { transactions: enriched };
  }
  
  @UseGuards(JWTAuthGuard)
  @Get(':id')
  async get(@UserId() userId: string, @Param() params: TransactionIdDto) {
    const { transaction: tx } = await this.rmq.send<
      TransactionGet.Request,
      TransactionGet.Response
    >(TransactionGet.topic, {
      userId,
      id: params.id,
      peers: params.peers ?? [],
    });

    /* --- общие данные пользователя и категории -------------------- */
    const [userRes, catRes] = await Promise.all([
      this.rmq.send<AccountUserInfo.Request, AccountUserInfo.Response>(
        AccountUserInfo.topic, { id: tx.userId },
      ),
      this.rmq.send<CategoryGet.Request, CategoryGet.Response>(
        CategoryGet.topic, { userId, id: tx.categoryId },
      ),
    ]);

    const base = {
      _id: tx._id,
      type: tx.type,
      amount: tx.amount,
      date: isoDateOnly(tx.date),
      description: tx.description,
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
      const [fromAccRes, toAccRes] = await Promise.all([
        this.rmq.send<AccountGet.Request, AccountGet.Response>(
          AccountGet.topic, { userId, id: tx.accountId },
        ),
        this.rmq.send<AccountGet.Request, AccountGet.Response>(
          AccountGet.topic, { userId, id: tx.toAccountId! },
        ),
      ]);

      const toOwnerId = toAccRes.account.userId;
      let toOwner: { name: string } | undefined;
      if (toOwnerId !== userId) {
        const ownerRes = await this.rmq.send<
          AccountUserInfo.Request,
          AccountUserInfo.Response
        >(AccountUserInfo.topic, { id: toOwnerId });
        toOwner = { name: ownerRes.profile.displayName };
      }

      return {
        transaction: {
          ...base,
          fromAccount: pick(
            fromAccRes.account,
            ['name', 'type', 'currency'],
          ),
          toAccount: {
            ...pick(
              toAccRes.account,
              ['name', 'type', 'currency'],
            ),
            owner: toOwner,
          },
        },
      };
    }
    /* -------------------------------------------------------------- */
    const accRes = await this.rmq.send<AccountGet.Request, AccountGet.Response>(
      AccountGet.topic, { userId, id: tx.accountId },
    );

    return {
      transaction: {
        ...base,
        account: pick(
          accRes.account,
          ['name', 'type', 'currency'],
        ),
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
    await this.rmq.send<
      TransactionPurge.Request,
      TransactionPurge.Response
    >(
      TransactionPurge.topic,
      {
        userId,
        id: params.id,
      },
    );
    return {};
  }
}
