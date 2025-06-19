import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './models/notification.model';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { NotificationRepo } from './repositories/notification.repository';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from '../configs/jwt.config';
import { NotificationService } from './notification.service';
import { SyncGateway } from './sync.gateway';
import { SyncService } from './sync.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    JwtModule.registerAsync(getJWTConfig()),
  ],
  controllers: [NotificationController],
  providers: [NotificationRepo, NotificationGateway, SyncGateway, NotificationService, SyncService]
})
export class NotificationModule {}
