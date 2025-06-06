import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId }       from '../guards/user.decorator';
import {
  SharedAccessInvite,
  SharedAccessAccept,
  SharedAccessReject,
  SharedAccessList,
  AccountUserInfo,
  SharedAccessTerminate,
} from '@moneytracker/contracts';
import { InviteDto  } from '../dtos/invite.dto';
import { RespondDto } from '../dtos/respond.dto';

@Controller('access')
export class AccessController {
  constructor(private readonly rmqService: RMQService) {}

  /** ➜ /access/invite — отправить приглашение */
  @UseGuards(JWTAuthGuard)
  @Post('invite')
  async invite(
    @UserId() userId: string,
    @Body() dto: InviteDto,
  ) {
    return this.rmqService.send<
      SharedAccessInvite.Request,
      SharedAccessInvite.Response
    >(SharedAccessInvite.topic, {
      fromUserId: userId,
      toUserId:   dto.toUserId,
    });
  }

  /** ➜ /access/respond — принять или отклонить приглашение */
  @UseGuards(JWTAuthGuard)
  @Post('respond')
  async respond(
    @UserId() userId: string,
    @Body() dto: RespondDto,
  ) {
    if (dto.action === 'accept') {
      return this.rmqService.send<
        SharedAccessAccept.Request,
        SharedAccessAccept.Response
      >(SharedAccessAccept.topic, {
        userId,
        inviteId: dto.inviteId,
      });
    }

    // action === 'reject'
    return this.rmqService.send<
      SharedAccessReject.Request,
      SharedAccessReject.Response
    >(SharedAccessReject.topic, {
      userId,
      inviteId: dto.inviteId,
    });
  }

  /** ➜ GET /access/peers — список пользователей с совместным доступом */
  @UseGuards(JWTAuthGuard)
  @Get('peers')
  async peers(@UserId() userId: string) {
    /* 1.	Берём id всех «партнёров» */
    const { peers } = await this.rmqService.send<
      SharedAccessList.Request,
      SharedAccessList.Response
    >(SharedAccessList.topic, { userId });

    if (!peers.length) return { users: [] };

    /* 2.	Для каждого id запрашиваем публичный профиль */
    const users = await Promise.all(
      peers.map(async id => {
        const { profile } = await this.rmqService.send<
          AccountUserInfo.Request,
          AccountUserInfo.Response
        >(AccountUserInfo.topic, { id });
        return {
          id,
          email:       profile.email,
          displayName: profile.displayName,
        };
      }),
    );
    return { users };
  }

  /** ➜ POST /access/terminate — расторгнуть совместный доступ */
  @UseGuards(JWTAuthGuard)
  @Post('terminate')
  async terminate(
    @UserId() userId: string,
    @Body('peerId') peerId: string,      // peerId передаётся простым JSON: { peerId: "…" }
  ) {
    return this.rmqService.send<
      SharedAccessTerminate.Request,
      SharedAccessTerminate.Response
    >(SharedAccessTerminate.topic, { userId, peerId });
  }
}