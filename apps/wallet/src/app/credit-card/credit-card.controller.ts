import { Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  CreditCreate,
  CreditGetAvailable,
  CreditUpdateLimit,
} from '@moneytracker/contracts';
import { CreditService } from './credit-card.service';
import { CreditPeriodService } from './credit-period.service';

@Controller()
export class CreditController {
  constructor(private readonly svc: CreditService,
    private readonly creditPeriodSvc: CreditPeriodService
  ) {}

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

  @RMQValidate()
  @RMQRoute(CreditGetAvailable.topic)
  async getAvailable(
    payload: CreditGetAvailable.Request
  ): Promise<CreditGetAvailable.Response> {
    const available = await this.creditPeriodSvc.getAvailableCredit(payload.accountId);
    return { available };
  }
}