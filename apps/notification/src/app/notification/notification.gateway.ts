import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
  import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: '/notifications', cors: true })
export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server!: Server;
  private readonly log = new Logger(NotificationGateway.name);

  constructor(
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
  ) {}

  /* ---------------------------------------------------------- */
  /** middleware: проверяем JWT и join-им в room=userId */
  afterInit() {
    const secret = this.cfg.get<string>('JWT_SECRET');

    this.server.use((socket, next) => {
      try {
        const token =
          socket.handshake.auth?.token ||
          socket.handshake.query?.token;      // → фронт может передать любым из двух способов

        if (!token) return next(new Error('No token'));

        const payload: any = this.jwt.verify(token, { secret });
        socket.data.userId = payload.id;
        socket.join(payload.id);              // room = userId
        return next();
      } catch {
        return next(new Error('Unauthorized'));
      }
    });

    this.log.log('Notification WS initialised');
  }

  handleConnection(client: Socket) {
    this.log.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.log.log(`Client disconnected: ${client.id}`);
  }

  /** Отправить событие конкретному пользователю (по room `user:{id}`) */
  emitToUser(userId: string, payload: { text: string; id: string }) {
    this.server.to(`user:${userId}`).emit('notification', payload);
  }
}