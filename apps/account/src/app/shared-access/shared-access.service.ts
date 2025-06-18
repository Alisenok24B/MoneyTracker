import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InviteRepo } from './repositories/invite.repository';
import { PeerRepo }   from './repositories/peer.repository';
import { RMQService } from 'nestjs-rmq';
import { NotificationRead, NotificationSend } from '@moneytracker/contracts';
import { AccessMessages } from './access.messages';
import { InviteEntity } from './entities/invite.entity';
import { UserRepository } from '../user/repositories/user.repository';

@Injectable()
export class SharedAccessService {
  private log = new Logger(SharedAccessService.name);
  constructor(
    private readonly invites: InviteRepo,
    private readonly peers:   PeerRepo,
    private readonly users:   UserRepository,
    private readonly rmq:     RMQService
  ) {}

  /* ───────────────── helpers ───────────────── */
  private async userName(id: string): Promise<string> {
    const u = await this.users.findUserById(id);
    return u.displayName;
  }

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

    const fromName = await this.userName(from);

    // создаём уведомление и сохраняем его id внутрь приглашения
    const { notificationId } = await this.rmq.send<NotificationSend.Request, any>(
        NotificationSend.topic,
        { 
          userId: to, 
          text: AccessMessages.invite(fromName),
          requiresResponse: true,
          inviteId: inv._id.toString(),
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
    const toName = await this.userName(inv.toUserId);
    await this.rmq.notify(NotificationSend.topic, {
        userId: inv.fromUserId,
        text:   AccessMessages.accepted(toName),
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
    const toName = await this.userName(inv.toUserId);
    await this.rmq.notify(NotificationSend.topic, {
        userId: inv.fromUserId,
        text:   AccessMessages.rejected(toName),
    });
  }

  /* ───────────────── list ───────────────── */
  async listPeers(userId: string): Promise<string[]> {
    return this.peers.listPeers(userId);
  }

  /* ───────────────── terminate ───────────────── */
  async terminate(userId: string, peerId: string) {
    /* 1.  проверяем, что связь есть */
    const peers = await this.peers.listPeers(userId);
    const exists = peers.includes(peerId);
    if (!exists) {
      throw new BadRequestException('Shared access not found');
    }
    this.log.log(`userId: ${userId}, peerId: ${peerId}`)
    /* 2.  удаляем пару */
    await this.peers.removePair(userId, peerId);

    /* 3.  уведомляем вторую сторону */
    const fromName = await this.userName(userId);
    await this.rmq.notify(NotificationSend.topic, {
      userId : peerId,
      text:   AccessMessages.canceled(fromName),
    });
  }
}
