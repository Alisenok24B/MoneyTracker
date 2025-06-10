import { Body, Controller, Logger } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { TransactionList, TransactionGet, TransactionSummary } from '@moneytracker/contracts';
import { TransactionService } from './transaction.service';

@Controller()
export class TransactionQueries {
  constructor(private readonly svc: TransactionService) {}
  private readonly logger = new Logger(TransactionService.name);

  @RMQValidate()
  @RMQRoute(TransactionList.topic)
  async list(
    @Body() dto: TransactionList.Request): Promise<TransactionList.Response> {
      this.logger.log(`А Я ДТО ИЗ RMQ: ${dto.accountIds}`)
    const txs = await this.svc.list(
      dto.userId,
      dto.peers ?? [],
      dto.type,
      dto.accountIds,
      dto.userIds,
      dto.categoryIds,
      dto.date,
      dto.month,
      dto.year,
      dto.from,
      dto.to,
    );
    return { transactions: txs };
  }

  @RMQValidate()
  @RMQRoute(TransactionGet.topic)
  async get(@Body() dto: TransactionGet.Request): Promise<TransactionGet.Response> {
    const tx = await this.svc.get(dto.userId, dto.id, dto.peers ?? []);
    return { transaction: tx };
  }

  @RMQValidate()
  @RMQRoute(TransactionSummary.topic)
  async summary(
    @Body() dto: TransactionSummary.Request,
  ): Promise<TransactionSummary.Response> {
    return this.svc.summary(
      dto.userId,
      dto.peers ?? [],
      dto.type as 'income' | 'expense',
      dto.accountIds,
      dto.from ? new Date(dto.from) : undefined,
      dto.to   ? new Date(dto.to)   : undefined,
    );
  }
}