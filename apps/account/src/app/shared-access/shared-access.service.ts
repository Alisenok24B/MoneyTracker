import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InviteRepo } from './repositories/invite.repository';
import { PeerRepo }   from './repositories/peer.repository';
import { RMQService } from 'nestjs-rmq';
import { NotificationSend } from '@moneytracker/contracts';

@Injectable()
export class SharedAccessService {
  constructor(
    private readonly invites: InviteRepo,
    private readonly peers:   PeerRepo,
    private readonly rmq:     RMQService
  ) {}

  async invite(from: string, to: string) {
    if (from === to) throw new BadRequestException('Cannot invite yourself');
    const inv = await this.invites.create(from, to);
    await this.rmq.notify(NotificationSend.topic, {
      userId: to,
      text:   `Пользователь пригласил вас к совместному бюджету`,
    });
    return inv._id.toString();
  }

  async accept(userId: string, inviteId: string) {
    const inv = await this.invites.findById(inviteId);
    if (!inv || inv.toUserId !== userId) throw new NotFoundException('Invite not found');
    await this.invites.setAccepted(inviteId);
    await this.peers.addPair(inv.fromUserId, inv.toUserId);
  }

  async listPeers(userId: string): Promise<string[]> {
    const list = await this.peers.listPeers(userId);
    return list.map(p => p.peerId);
  }
}
