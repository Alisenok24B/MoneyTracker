// apps/notification/src/app/notification/notification.controller.ts
import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  NotificationSend,
  NotificationRead,
  NotificationListUnread,
} from '@moneytracker/contracts';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly svc: NotificationService) {}

  @RMQValidate()
  @RMQRoute(NotificationSend.topic)
  send(@Body() dto: NotificationSend.Request) {
    return this.svc.send(dto);
  }

  @RMQValidate()
  @RMQRoute(NotificationRead.topic)
  read(@Body() dto: NotificationRead.Request) {
    return this.svc.markRead(dto);
  }

  @RMQValidate()
  @RMQRoute(NotificationListUnread.topic)
  listUnread(@Body() dto: NotificationListUnread.Request) {
    return this.svc.listUnread(dto);
  }
}