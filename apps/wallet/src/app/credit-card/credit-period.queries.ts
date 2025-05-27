import { Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
    CreditPeriodDebt,
    CreditPeriodGet,
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

  @RMQValidate()
  @RMQRoute(CreditPeriodGet.topic)
  async getPeriod(
    payload: CreditPeriodGet.Request
  ): Promise<CreditPeriodGet.Response> {
    const period = await this.svc.getPeriod(payload.accountId, payload.periodId);
    return { period };
  }

  @RMQValidate()
  @RMQRoute(CreditPeriodDebt.topic)
  async getDebt(
    payload: CreditPeriodDebt.Request
  ): Promise<CreditPeriodDebt.Response> {
    const debt = await this.svc.calculateDebt(payload.periodId);
    return { debt };
  }
}