import { Injectable, Logger } from '@nestjs/common';
import { SyncGateway } from './sync.gateway';
import { RMQRoute } from 'nestjs-rmq';

@Injectable()
export class SyncService {
  private readonly log = new Logger(SyncService.name);

  constructor(private readonly gateway: SyncGateway) {}

  /**
   * Слушает RMQ-события sync.peer.event и пушит по WS всем нужным peer-ам
   */
  @RMQRoute('sync.peer.event')
  async handlePeerEvent(payload: {
    userIds: string[];    // Кому отправить (автор + все peers)
    type: string;         // Тип сущности ('transaction', 'account', 'category', 'profile')
    action: string;       // Действие ('create', 'update', 'delete')
    data: any;            // Сама сущность/ID
  }) {
    this.log.log(`WS sync: ${payload.type} ${payload.action} → [${payload.userIds.join(',')}]`);
    this.gateway.emitToUsers(payload.userIds, {
      type: `${payload.type}.${payload.action}`,
      data: payload.data,
    });
    return {};
  }
}