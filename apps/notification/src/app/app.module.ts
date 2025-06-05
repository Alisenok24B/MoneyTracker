import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from './notification/notification.module';
import { ConfigModule } from '@nestjs/config';
import { getRMQConfig } from './configs/rmq.config';
import { RMQModule } from 'nestjs-rmq';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './configs/mongo.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.notification.env' }),
    RMQModule.forRootAsync(getRMQConfig()),
    NotificationModule,
    MongooseModule.forRootAsync(getMongoConfig()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
