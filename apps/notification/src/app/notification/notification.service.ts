import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NotificationRepo } from './repositories/notification.repository';
import { NotificationGateway } from './notification.gateway';
import { NotificationListUnread, NotificationRead, NotificationSend } from '@moneytracker/contracts';
import { NotificationEntity } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  private log = new Logger(NotificationService.name);
  constructor(
    private readonly repo: NotificationRepo,
    private readonly ws  : NotificationGateway,
  ) {}

  async send(dto: NotificationSend.Request): Promise<NotificationSend.Response> {
    // 1. Сохраняем
    const doc = await this.repo.create(
      new NotificationEntity({
        userId:   dto.userId,
        text:     dto.text,
        requiresResponse: dto.requiresResponse ?? false,
        inviteId: dto.inviteId,
      }),
    );

    // 2. Web-socket push
    this.ws.emitToUser(dto.userId, { id: doc._id.toString(), text: dto.text, inviteId: dto.inviteId.toString() });

    // 3. Лог
    this.log.log(`notify → ${dto.userId}: "${dto.text}"`);

    // 4. Отдаём id
    return { notificationId: doc._id.toString() };
  }

  /** пометить read */
  async markRead(dto: NotificationRead.Request): Promise<NotificationRead.Response> {
    const doc = await this.repo.findById(dto.notificationId);

    if (!doc || doc.userId.toString() !== dto.userId) {
      throw new NotFoundException('Notification not found');
    }

    await this.repo.markRead(dto.notificationId);
    return {};
  }

  async listUnread(dto: NotificationListUnread.Request): Promise<NotificationListUnread.Response> {
    const raw = await this.repo.findUnread(dto.userId);

    const notifications = raw.map(n => ({
      _id      : n._id.toString(),
      text     : n.text,
      read     : n.read,
      createdAt: n.createdAt!,
      requiresResponse: n.requiresResponse,
      inviteId: n.inviteId,
    }));

    return { notifications };
  }
}