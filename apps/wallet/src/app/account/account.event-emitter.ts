// apps/wallet-service/src/app/account/account.event-emitter.ts
import { Injectable } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { IDomainEvent } from '@moneytracker/interfaces';


@Injectable()
export class AccountEventEmitter {
  constructor(private readonly rmqService: RMQService) {}

  async emit(events: IDomainEvent[]) {
    for (const event of events) {
      await this.rmqService.notify(event.topic, event.data);
    }
  }
}
