import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InviteRepo } from './repositories/invite.repository';
import { PeerRepo }   from './repositories/peer.repository';
import { RMQService } from 'nestjs-rmq';
import { NotificationRead, NotificationSend } from '@moneytracker/contracts';
import { AccessMessages } from './access.messages';
import { InviteEntity } from './entities/invite.entity';

@Injectable()
export class SharedAccessService {
  private log = new Logger(SharedAccessService.name);
  constructor(
    private readonly invites: InviteRepo,
    private readonly peers:   PeerRepo,
    private readonly rmq:     RMQService
  ) {}

  /* ───────────────── invite ───────────────── */
  async invite(from: string, to: string) {
    if (from === to) throw new BadRequestException('Cannot invite yourself');

    /* 0. Уже являемся «парами»? — запрещаем повторно приглашать */
    if (await this.peers.existsPair(from, to)) {
      throw new BadRequestException(
        'Shared access with this user already exists',
      );
    }

    const inv = await this.invites.create(
      new InviteEntity({ fromUserId: from, toUserId: to })
    );

    // создаём уведомление и сохраняем его id внутрь приглашения
    const { notificationId } = await this.rmq.send<NotificationSend.Request, any>(
        NotificationSend.topic,
        { 
          userId: to, 
          text: 'Приглашение в совместный бюджет',
          requiresResponse: true,
        },
    );
    await this.invites.update(inv._id.toString(), { notificationId });

    return inv._id.toString();
  }

  /* ───────────────── accept ───────────────── */
  async accept(userId: string, inviteId: string) {
    const inv = await this.invites.findById(inviteId);
    if (!inv || inv.toUserId !== userId) {
      throw new NotFoundException('Invite not found');
    }
    if (inv.status !== 'pending') {
      throw new BadRequestException('Invite is already processed');
    }

    await this.invites.setAccepted(inviteId);
    await this.peers.ensurePair(inv.fromUserId, inv.toUserId);

    // 1. гасим уведомление у получателя
    if (inv.notificationId) {
        await this.rmq.send<NotificationRead.Request, any>(
        NotificationRead.topic,
        { 
          userId: inv.toUserId,
          notificationId: inv.notificationId 
        },
      );
    }

    // 2. шлём уведомление инициатору
    await this.rmq.notify(NotificationSend.topic, {
        userId: inv.fromUserId,
        text: 'Ваше приглашение принято',
    });
  }

  /* ───────────────── reject ───────────────── */
  async reject(userId: string, inviteId: string) {
    const inv = await this.invites.findById(inviteId);
    if (!inv || inv.toUserId !== userId) {
      this.log.log(inv);
      //this.log.log(`toUserId = ${inv.toUserId}`);
      throw new NotFoundException('Invite not found');
    }
    if (inv.status !== 'pending') {
      throw new BadRequestException('Invite is already processed');
    }

    await this.invites.setRejected(inviteId);

    // 1. гасим уведомление у получателя
    if (inv.notificationId) {
        await this.rmq.send<NotificationRead.Request, any>(
        NotificationRead.topic,
        { 
          userId: inv.toUserId,
          notificationId: inv.notificationId 
        },
      );
    }

    // 2. уведомляем инициатора
    await this.rmq.notify(NotificationSend.topic, {
        userId: inv.fromUserId,
        text: 'Ваше приглашение отклонено',
    });
  }

  /* ───────────────── list ───────────────── */
  async listPeers(userId: string): Promise<string[]> {
    return this.peers.listPeers(userId);
  }
}
