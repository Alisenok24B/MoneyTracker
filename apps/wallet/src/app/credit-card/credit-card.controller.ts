import { Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  CreditCreate,
  CreditUpdateLimit,
} from '@moneytracker/contracts';
import { CreditService } from './credit-card.service';

@Controller()
export class CreditController {
  constructor(private readonly svc: CreditService) {}

  @RMQValidate()
  @RMQRoute(CreditCreate.topic)
  async create(cmd: CreditCreate.Request): Promise<CreditCreate.Response> {
    await this.svc.createForAccount(cmd.accountId, cmd.details);
    return {};
  }

  @RMQValidate()
  @RMQRoute(CreditUpdateLimit.topic)
  async updateLimit(cmd: CreditUpdateLimit.Request): Promise<CreditUpdateLimit.Response> {
    await this.svc.updateCreditLimit(cmd.accountId, cmd.creditLimit);
    return {};
  }
}