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
  import {
    TransactionCreate,
    TransactionList,
    TransactionGet,
    TransactionUpdate,
    TransactionDelete,
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
      const res = await this.rmq.send<
        TransactionList.Request,
        TransactionList.Response
      >(
        TransactionList.topic,
        {
          userId,
          accountId: dto.accountId,
          peers: dto.peers || [],
        },
      );
      return { transactions: res.transactions };
    }
  
    @UseGuards(JWTAuthGuard)
    @Get(':id')
    async get(
      @UserId() userId: string,
      @Param() params: TransactionIdDto,
    ) {
      const res = await this.rmq.send<
        TransactionGet.Request,
        TransactionGet.Response
      >(
        TransactionGet.topic,
        {
          userId,
          id: params.id,
          peers: params.peers || [],
        },
      );
      return { transaction: res.transaction };
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
  