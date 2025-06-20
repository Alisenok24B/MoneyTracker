import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './configs/mongo.config';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './configs/rmq.config';
import { SharedAccessModule } from './shared-access/shared-access.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.account.env' }),
    RMQModule.forRootAsync(getRMQConfig()),
    UserModule,
    AuthModule,
    MongooseModule.forRootAsync(getMongoConfig()),
    SharedAccessModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
