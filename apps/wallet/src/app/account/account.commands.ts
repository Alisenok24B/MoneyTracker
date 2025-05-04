import { Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  AccountCreate,
  AccountUpdate,
  AccountDelete,
} from '@moneytracker/contracts';
import { AccountService } from './account.service';
import { AccountType, ICreditDetails, IAccount } from '@moneytracker/interfaces';

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
    const { userId, name, type, currency, creditDetails } = payload;
    const account = await this.service.createAccount({
      userId,
      name,
      type: type as AccountType,
      currency,
      creditDetails,
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
    const { userId, id, name, type, currency, creditDetails } = payload;
    const updateData: Partial<IAccount> = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type as AccountType;
    if (currency !== undefined) updateData.currency = currency;
    if (creditDetails !== undefined) updateData.creditDetails = creditDetails as ICreditDetails;

    await this.service.updateAccount(userId, id, updateData);
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
    const { userId, id } = payload;
    await this.service.deleteAccount(userId, id);
    return {};
  }
}
