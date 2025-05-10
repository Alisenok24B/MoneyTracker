import { Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { CreditGetCurrentPeriod } from '@moneytracker/contracts';
import { CreditRepository } from './repositories/credit.repository';

@Controller()
export class CreditQueries {
  constructor(private readonly repo: CreditRepository) {}

  @RMQValidate()
  @RMQRoute(CreditGetCurrentPeriod.topic)
  async getCurrent({ accountId }: CreditGetCurrentPeriod.Request): Promise<CreditGetCurrentPeriod.Response> {
    const period = await this.repo.findCurrent(accountId);
    return { period };
  }
}