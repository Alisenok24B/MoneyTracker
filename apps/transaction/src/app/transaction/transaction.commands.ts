import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  TransactionCreate,
  TransactionUpdate,
  TransactionDelete,
  TransactionPurge,
} from '@moneytracker/contracts';
import { TransactionService } from './transaction.service';

@Controller()
export class TransactionCommands {
  constructor(private readonly svc: TransactionService) {}

  @RMQValidate()
  @RMQRoute(TransactionCreate.topic)
  async create(@Body() dto: TransactionCreate.Request): Promise<TransactionCreate.Response> {
    const transaction = await this.svc.create(dto.userId, dto);
    return { transaction };
  }

  @RMQValidate()
  @RMQRoute(TransactionUpdate.topic)
  async update(@Body() dto: TransactionUpdate.Request): Promise<TransactionUpdate.Response> {
    const transaction = await this.svc.update(dto.userId, dto.id, dto);
    return { transaction };
  }

  @RMQValidate()
  @RMQRoute(TransactionDelete.topic)
  async delete(@Body() dto: TransactionDelete.Request): Promise<TransactionDelete.Response> {
    await this.svc.delete(dto.userId, dto.id);
    return {};
  }

  @RMQValidate()
  @RMQRoute(TransactionPurge.topic)
  async purge(@Body() dto: TransactionPurge.Request): Promise<TransactionPurge.Response> {
    await this.svc.purge(dto.userId, dto.id);
    return {};
  }
}