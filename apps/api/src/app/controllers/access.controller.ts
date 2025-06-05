import {
    Body,
    Controller,
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
  }