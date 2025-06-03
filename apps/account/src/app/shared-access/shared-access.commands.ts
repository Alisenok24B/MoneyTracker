import { Body, Controller } from '@nestjs/common';
import { RMQValidate, RMQRoute } from 'nestjs-rmq';
import {
  SharedAccessInvite,
  SharedAccessAccept,
  SharedAccessList,
} from '@moneytracker/contracts';
import { SharedAccessService } from './shared-access.service';

@Controller()
export class SharedAccessController {
  constructor(private readonly svc: SharedAccessService) {}

  @RMQValidate()
  @RMQRoute(SharedAccessInvite.topic)
  async invite(@Body() dto: SharedAccessInvite.Request): Promise<SharedAccessInvite.Response> {
    await this.svc.invite(dto.fromUserId, dto.toUserId);
    return {};
  }

  @RMQValidate()
  @RMQRoute(SharedAccessAccept.topic)
  async accept(@Body() dto: SharedAccessAccept.Request): Promise<SharedAccessAccept.Response> {
    await this.svc.accept(dto.userId, dto.inviteId);
    return {};
  }

  @RMQValidate()
  @RMQRoute(SharedAccessList.topic)
  async list(@Body() dto: SharedAccessList.Request): Promise<SharedAccessList.Response> {
    const peers = await this.svc.listPeers(dto.userId);
    return { peers };
  }
}