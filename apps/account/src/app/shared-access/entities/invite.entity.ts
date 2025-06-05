import { IDomainEvent } from '@moneytracker/interfaces';

export class InviteEntity {
  _id?: string;
  fromUserId!: string;
  toUserId!: string;
  status: 'pending' | 'accepted' | 'rejected' = 'pending';
  notificationId?: string;
  createdAt?: Date;

  // Доменные события (пригодится, если понадобится триггерить RMQ)
  events: IDomainEvent[] = [];

  constructor(data: Partial<InviteEntity>) {
    Object.assign(this, data);
  }

  markAccepted(): this {
    this.status = 'accepted';
    this.events.push({ topic: 'invite.accepted', data: { inviteId: this._id } });
    return this;
  }

  markRejected(): this {
    this.status = 'rejected';
    this.events.push({ topic: 'invite.rejected', data: { inviteId: this._id } });
    return this;
  }
}