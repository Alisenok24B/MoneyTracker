import { Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { CreditCalculatePeriod, CreditCheckOverdue } from '@moneytracker/contracts';
import { CreditService } from './credit.service';

@Controller()
export class CreditCommands {
  constructor(private readonly service: CreditService) {}

  @RMQValidate()
  @RMQRoute(CreditCalculatePeriod.topic)
  async calculate({ accountId }: CreditCalculatePeriod.Request): Promise<CreditCalculatePeriod.Response> {
    await this.service.initializePeriod(accountId);
    return {};
  }

  @RMQValidate()
  @RMQRoute(CreditCheckOverdue.topic)
  async check(): Promise<CreditCheckOverdue.Response> {
    await this.service.checkOverdue();
    return {};
  }
}