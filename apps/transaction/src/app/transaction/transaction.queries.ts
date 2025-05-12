import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { TransactionList, TransactionGet } from '@moneytracker/contracts';
import { TransactionService } from './transaction.service';

@Controller()
export class TransactionQueries {
  constructor(private readonly svc: TransactionService) {}

  @RMQValidate()
  @RMQRoute(TransactionList.topic)
  async list(
    @Body() dto: TransactionList.Request): Promise<TransactionList.Response> {
    const txs = await this.svc.list(
      dto.userId,
      dto.peers || [],
      dto.type,    );
    return { transactions: txs };
  }

  @RMQValidate()
  @RMQRoute(TransactionGet.topic)
  async get(@Body() dto: TransactionGet.Request): Promise<TransactionGet.Response> {
    const tx = await this.svc.get(dto.userId, dto.id, dto.peers || []);
    return { transaction: tx };
  }
}