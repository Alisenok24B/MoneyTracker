import { Body, Controller, Logger } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  NotificationSend,
  NotificationRead,
  NotificationListUnread,
} from '@moneytracker/contracts';
import { NotificationRepo } from './repositories/notification.repository';
import { NotificationGateway } from './notification.gateway';

@Controller()
export class NotificationController {
  private log = new Logger('NotifySvc');

  constructor(
    private readonly repo: NotificationRepo,
    private readonly ws  : NotificationGateway,   // 🔸 инжектируем gateway
  ) {}

  @RMQValidate()
  @RMQRoute(NotificationSend.topic)
  async send(@Body() dto: NotificationSend.Request): Promise<NotificationSend.Response> {
    // 1. Сохраняем
    const doc = await this.repo.create(dto.userId, dto.text);

    // 2. Web-Socket push (по room `user:${id}`)
    this.ws.emitToUser(dto.userId, { text: dto.text, id: doc._id.toString() });

    // 3. Логируем
    this.log.log(`notify → ${dto.userId}: "${dto.text}"`);

    // 4. Можно вернуть id уведомления вызывающей стороне
    return { notificationId: doc._id.toString() } as any;
  }

  @RMQValidate()
  @RMQRoute(NotificationRead.topic)
  async read(@Body() dto: NotificationRead.Request): Promise<NotificationRead.Response> {
    await this.repo.markRead(dto.notificationId);
    return {};
  }

  @RMQValidate()
@RMQRoute(NotificationListUnread.topic)
async listUnread(
  @Body() dto: NotificationListUnread.Request,
): Promise<NotificationListUnread.Response> {
  const raw = await this.repo.findUnread(dto.userId);
  const notifications = raw.map(n => ({
    _id       : n._id.toString(),
    text      : n.text,
    read      : n.read,
    createdAt : n.createdAt,
  }));
  return { notifications };
}
}