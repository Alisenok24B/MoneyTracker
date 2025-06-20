import { Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  AccountCreate,
  AccountUpdate,
  AccountDelete,
} from '@moneytracker/contracts';
import { AccountService } from './account.service';
import { AccountType, ICreditCardDetails, IAccount } from '@moneytracker/interfaces';

@Controller()
export class AccountCommands {
  constructor(private readonly service: AccountService) {}

  /**
   * Создание нового счёта. Принимает userId из payload,
   * валидируется в контракте AccountCreate.Request
   */
  @RMQValidate()
  @RMQRoute(AccountCreate.topic)
  async create(
    payload: AccountCreate.Request,
  ): Promise<AccountCreate.Response> {
    const { userId, name, type, balance, currency, creditDetails, peers } = payload;
    const account = await this.service.createAccount({
      userId,
      name,
      type: type as AccountType,
      balance,
      currency,
      creditDetails,
      peers: peers ?? []
    });
    return { accountId: account._id! };
  }

  /**
   * Обновление счёта. Принимает userId и id счёта,
   * проверяет доступ и факт существования/не удаления,
   * собирает updateData и передаёт в сервис
   */
  @RMQValidate()
  @RMQRoute(AccountUpdate.topic)
  async update(
    payload: AccountUpdate.Request,
  ): Promise<AccountUpdate.Response> {
    const { userId, id, name, creditDetails, peers } = payload;

    const updateData: Partial<IAccount> = {};
    if (name !== undefined) {
      updateData.name = name;
    }

    // если пришёл объект creditDetails с полем creditLimit
    if (creditDetails?.creditLimit !== undefined) {
      updateData.creditDetails = {
        creditLimit: creditDetails.creditLimit,
      } as IAccount['creditDetails'];
    }

    await this.service.updateAccount(userId, id, peers, updateData);
    return {};
  }

  /**
   * Soft-delete счёта. Принимает userId и id счёта,
   * сервис проверяет права и выставляет deletedAt + эмиттит event
   */
  @RMQValidate()
  @RMQRoute(AccountDelete.topic)
  async delete(
    payload: AccountDelete.Request,
  ): Promise<AccountDelete.Response> {
    const { userId, id, peers } = payload;
    await this.service.deleteAccount(userId, id, peers);
    return {};
  }
}
