import { Controller } from '@nestjs/common';
import { RMQRoute } from 'nestjs-rmq';
import { IDomainEvent } from '@moneytracker/interfaces';
import { CreditService } from './credit.service';

@Controller()
export class CreditEventHandler {
  constructor(private readonly service: CreditService) {}

  // Слушаем событие создания аккаунта-карты
  @RMQRoute('account.created.event')
  async handleAccountCreated(event: IDomainEvent) {
    const { accountId } = event.data as { accountId: string };
    await this.service.initializePeriod(accountId);
  }
}