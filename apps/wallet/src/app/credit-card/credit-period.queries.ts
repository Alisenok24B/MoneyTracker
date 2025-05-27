import { Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  CreditPeriodsDebts,  // новый контракт
} from '@moneytracker/contracts';
import { CreditPeriodService } from './credit-period.service';

@Controller()
export class CreditPeriodQueries {
  constructor(private readonly svc: CreditPeriodService) {}

  @RMQValidate()
  @RMQRoute(CreditPeriodsDebts.topic)
  async listDebts(
    payload: CreditPeriodsDebts.Request
  ): Promise<CreditPeriodsDebts.Response> {
    const entries = await this.svc.listOutstandingDebts(payload.accountId);
    return { debts: entries };
  }
}