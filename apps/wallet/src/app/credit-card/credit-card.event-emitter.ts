import { Injectable } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { IDomainEvent } from '@moneytracker/interfaces';

@Injectable()
export class CreditEventEmitter {
  constructor(private readonly rmq: RMQService) {}

  async emit(events: IDomainEvent[]) {
    for (const evt of events) {
      await this.rmq.notify(evt.topic, evt.data);
    }
  }
}