import { Injectable } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { IDomainEvent } from '@moneytracker/interfaces';

@Injectable()
export class TransactionEventEmitter {
  constructor(private readonly rmq: RMQService) {}

  async emit(events: IDomainEvent[]) {
    for (const e of events) {
      await this.rmq.notify(e.topic, e.data);
    }
  }
}
