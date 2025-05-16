import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RMQModule } from 'nestjs-rmq';
import { getMongoConfig } from './configs/mongo.config';
import { getRMQConfig } from './configs/rmq.config';
import { CreditCardModule } from './credit-card/credit-card.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'envs/.wallet.env',
    }),
    RMQModule.forRootAsync(getRMQConfig()),
    MongooseModule.forRootAsync(getMongoConfig()),
    AccountModule,
    CreditCardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
