import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountsBalanceHistory, AccountsUpcomingPayments } from '@moneytracker/contracts';
import {
  AccountList,
  AccountGet,
} from '@moneytracker/contracts';
import { AccountService } from './account.service';

@Controller()
export class AccountQueries {
  constructor(private readonly service: AccountService) {}

  @RMQValidate()
  @RMQRoute(AccountList.topic)
  async list(
    payload: AccountList.Request,
  ): Promise<AccountList.Response> {
    const { userId, peers } = payload;
    const accounts = await this.service.listAccounts(userId, peers ?? []);
    return { accounts };
  }

  @RMQValidate()
  @RMQRoute(AccountGet.topic)
  async get(
    payload: AccountGet.Request,
  ): Promise<AccountGet.Response> {
    const { userId, id, peers } = payload;
    const account = await this.service.getAccount(userId, id, peers ?? []);
    return { account };
  }

  @RMQValidate()
  @RMQRoute(AccountsUpcomingPayments.topic)
  async upcomingPayments(
  @Body() payload: AccountsUpcomingPayments.Request
  ): Promise<AccountsUpcomingPayments.Response> {
    const payments = await this.service.getUpcomingPayments(
      payload.userId, payload.peers || [],
    );
    return { payments };
  }

  @RMQValidate()
  @RMQRoute(AccountsBalanceHistory.topic)
  async balanceHistory(
    @Body() dto: AccountsBalanceHistory.Request,
  ): Promise<AccountsBalanceHistory.Response> {
    const dates = dto.dates?.map(d => new Date(d));
    const history = await this.service.getBalanceHistory(
      dto.userId,
      dto.peers || [],
      dto.accountIds,
      dates,
    );
    return { history };
  }
}
