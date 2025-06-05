import { Controller, Get, UseGuards } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';
import { NotificationListUnread } from '@moneytracker/contracts';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly rmq: RMQService) {}

  @UseGuards(JWTAuthGuard)
  @Get('unread')
  async unread(@UserId() userId: string) {
    return this.rmq.send<
      NotificationListUnread.Request,
      NotificationListUnread.Response
    >(NotificationListUnread.topic, { userId });
  }
}