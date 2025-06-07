import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { SharedAccessList } from '@moneytracker/contracts';
import { SharedAccessService } from './shared-access.service';

@Controller()
export class SharedAccessQueries {
  constructor(private readonly svc: SharedAccessService) {}

  @RMQValidate()
  @RMQRoute(SharedAccessList.topic)
  async list(@Body() dto: SharedAccessList.Request):
            Promise<SharedAccessList.Response> {
    const peers = await this.svc.listPeers(dto.userId);
    return { peers };
  }
}