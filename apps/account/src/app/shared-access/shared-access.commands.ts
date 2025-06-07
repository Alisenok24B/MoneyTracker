import { Body, Controller } from '@nestjs/common';
import { RMQValidate, RMQRoute } from 'nestjs-rmq';
import {
  SharedAccessInvite,
  SharedAccessAccept,
  SharedAccessList,
  SharedAccessReject,
  SharedAccessTerminate,
} from '@moneytracker/contracts';
import { SharedAccessService } from './shared-access.service';

@Controller()
export class SharedAccessCommands {
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
    @RMQRoute(SharedAccessReject.topic)
    async reject(@Body() dto: SharedAccessReject.Request): Promise<SharedAccessReject.Response> {
    await this.svc.reject(dto.userId, dto.inviteId);
    return {};
  }

  @RMQValidate()
  @RMQRoute(SharedAccessTerminate.topic)
  async terminate(
    @Body() dto: SharedAccessTerminate.Request,
  ): Promise<SharedAccessTerminate.Response> {
    await this.svc.terminate(dto.userId, dto.peerId);
    return {};
  }
}