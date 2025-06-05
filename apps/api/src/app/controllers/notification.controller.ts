import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';
import { NotificationListUnread, NotificationRead } from '@moneytracker/contracts';
import { MarkReadDto } from '../dtos/mark-read.dto';

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

  @UseGuards(JWTAuthGuard)
  @Patch('read')
  async markRead(@UserId() userId: string, @Body() dto: MarkReadDto) {
    return this.rmq.send<
        NotificationRead.Request,
        NotificationRead.Response
    >(NotificationRead.topic, {
        userId,
        notificationId: dto.notificationId,
    });
  }
}