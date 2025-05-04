import { Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
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
    const accounts = await this.service.listAccounts(userId, peers);
    return { accounts };
  }

  @RMQValidate()
  @RMQRoute(AccountGet.topic)
  async get(
    payload: AccountGet.Request,
  ): Promise<AccountGet.Response> {
    const { userId, id } = payload;
    const account = await this.service.getAccount(userId, id);
    return { account };
  }
}
