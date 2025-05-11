import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './configs/rmq.config';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from './configs/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { UserController } from './controllers/user.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { WalletController } from './controllers/wallet.controller';
import { CategoryController } from './controllers/category.controller';
import { TransactionController } from './controllers/transaction.controller';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: 'envs/.api.env', isGlobal: true}),
    RMQModule.forRootAsync(getRMQConfig()),
    JwtModule.registerAsync(getJWTConfig()),
    PassportModule.register({defaultStrategy: 'jwt'})
  ],
  controllers: [AuthController, UserController, WalletController, CategoryController, TransactionController],
  providers: [
    JwtStrategy
  ]
})
export class AppModule {}
