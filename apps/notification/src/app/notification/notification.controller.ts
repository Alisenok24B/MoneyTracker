import { Body, Controller, Logger } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { NotificationSend } from '@moneytracker/contracts';

@Controller()
export class NotificationController {
  private log = new Logger('NotifySvc');
  @RMQValidate()
  @RMQRoute(NotificationSend.topic)
  async send(@Body() dto: NotificationSend.Request): Promise<NotificationSend.Response> {
    // TODO: e-mail / push
    this.log.log(`Notify user=${dto.userId}: ${dto.text}`);
    return {};
  }
}