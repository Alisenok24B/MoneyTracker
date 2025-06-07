import { Injectable } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { SharedAccessList } from '@moneytracker/contracts';

@Injectable()
export class PeersHelper {
  constructor(private readonly rmq: RMQService) {}

  async getPeers(userId: string): Promise<string[]> {
    const { peers } = await this.rmq.send<
      SharedAccessList.Request,
      SharedAccessList.Response
    >(SharedAccessList.topic, { userId });
    return peers;
  }
}