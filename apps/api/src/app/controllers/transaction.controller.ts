// apps/api/src/app/controllers/transaction.controller.ts
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
  } from '@moneytracker/contracts';
  import { CreateTransactionDto } from '../dtos/create-transaction.dto';
  import { ListTransactionsDto } from '../dtos/list-transactions.dto';
  import { TransactionIdDto } from '../dtos/transaction-id.dto';
  import { UpdateTransactionDto } from '../dtos/update-transaction.dto';
  
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
    async list(
      @UserId() userId: string,
      @Query() dto: ListTransactionsDto,
    ) {
      const { transactions: flat } = await this.rmq.send<
        TransactionList.Request,
        TransactionList.Response
      >(TransactionList.topic, {
        userId,
        peers: dto.peers || [],
        type: dto.type,
      });

      const enriched = await Promise.all(
        flat.map(async tx => {
          if (tx.type === 'transfer') {
            const [fromAccRes, toAccRes] = await Promise.all([
              this.rmq.send<AccountGet.Request, AccountGet.Response>(
                AccountGet.topic,
                { userId, id: tx.accountId },
              ),
              this.rmq.send<AccountGet.Request, AccountGet.Response>(
                AccountGet.topic,
                { userId, id: tx.toAccountId! },
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
              _id: tx._id,
              type: tx.type,
              amount: tx.amount,
              date: tx.date,
              description: tx.description,
              fromAccount: pick(
                fromAccRes.account,
                ['name', 'type', 'balance', 'currency', 'creditDetails'],
              ),
              toAccount: {
                ...pick(
                  toAccRes.account,
                  ['name', 'type', 'balance', 'currency', 'creditDetails'],
                ),
                owner: toOwner,
              },
            };
          } else {
            const [userRes, accRes, catRes] = await Promise.all([
              this.rmq.send<AccountUserInfo.Request, AccountUserInfo.Response>(
                AccountUserInfo.topic,
                { id: tx.userId },
              ),
              this.rmq.send<AccountGet.Request, AccountGet.Response>(
                AccountGet.topic,
                { userId, id: tx.accountId },
              ),
              this.rmq.send<CategoryGet.Request, CategoryGet.Response>(
                CategoryGet.topic,
                { userId, id: tx.categoryId! },
              ),
            ]);

            return {
              _id: tx._id,
              user: { name: userRes.profile.displayName },
              account: pick(
                accRes.account,
                ['name', 'type', 'balance', 'currency', 'creditDetails'],
              ),
              category: pick(
                catRes.category,
                ['name', 'type', 'icon'],
              ),
              type: tx.type,
              amount: tx.amount,
              date: tx.date,
              description: tx.description
            };
          }
        }),
      );

      return { transactions: enriched };
    }
    
    @UseGuards(JWTAuthGuard)
    @Get(':id')
    async get(
      @UserId() userId: string,
      @Param() params: TransactionIdDto,
    ) {
      const { transaction: tx } = await this.rmq.send<
        TransactionGet.Request,
        TransactionGet.Response
      >(TransactionGet.topic, {
        userId,
        id: params.id,
        peers: params.peers || [],
      });

      if (tx.type === 'transfer') {
        const [fromAccRes, toAccRes] = await Promise.all([
          this.rmq.send<AccountGet.Request, AccountGet.Response>(
            AccountGet.topic,
            { userId, id: tx.accountId },
          ),
          this.rmq.send<AccountGet.Request, AccountGet.Response>(
            AccountGet.topic,
            { userId, id: tx.toAccountId! },
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
            _id: tx._id,
            type: tx.type,
            amount: tx.amount,
            date: tx.date,
            description: tx.description,
            deletedAt: tx.deletedAt ?? null,
            fromAccount: pick(
              fromAccRes.account,
              ['name', 'type', 'balance', 'currency', 'creditDetails'],
            ),
            toAccount: {
              ...pick(
                toAccRes.account,
                ['name', 'type', 'balance', 'currency', 'creditDetails'],
              ),
              owner: toOwner,
            },
          },
        };
      } else {
        const [userRes, accRes, catRes] = await Promise.all([
          this.rmq.send<AccountUserInfo.Request, AccountUserInfo.Response>(
            AccountUserInfo.topic,
            { id: tx.userId },
          ),
          this.rmq.send<AccountGet.Request, AccountGet.Response>(
            AccountGet.topic,
            { userId, id: tx.accountId },
          ),
          this.rmq.send<CategoryGet.Request, CategoryGet.Response>(
            CategoryGet.topic,
            { userId, id: tx.categoryId! },
          ),
        ]);

        return {
          transaction: {
            _id: tx._id,
            user: { name: userRes.profile.displayName },
            account: pick(
              accRes.account,
              ['name', 'type', 'balance', 'currency', 'creditDetails'],
            ),
            category: pick(
              catRes.category,
              ['name', 'type', 'icon'],
            ),
            type: tx.type,
            amount: tx.amount,
            date: tx.date,
            description: tx.description,
            deletedAt: tx.deletedAt ?? null,
          },
        };
      }
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
  
    @UseGuards(JWTAuthGuard)
    @Delete(':id')
    async delete(
      @UserId() userId: string,
      @Param() params: TransactionIdDto,
    ) {
      await this.rmq.send<
        TransactionDelete.Request,
        TransactionDelete.Response
      >(
        TransactionDelete.topic,
        {
          userId,
          id: params.id,
        },
      );
      return {};
    }
  }
  