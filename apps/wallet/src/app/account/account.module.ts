import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './models/account.model';
import { AccountService } from './account.service';
import { AccountRepository } from './repositories/account.repository';
import { AccountCommands } from './account.commands';
import { AccountQueries } from './account.queries';
import { RMQModule } from 'nestjs-rmq';
import { AccountEventEmitter } from './account.event-emitter';

@Module({
  imports: [
    MongooseModule.forFeature([ { name: Account.name, schema: AccountSchema } ])
  ],
  providers: [ AccountService, AccountRepository, AccountEventEmitter ],
  controllers: [ AccountCommands, AccountQueries ],
  exports: [ AccountService, AccountRepository ],
})
export class AccountModule {}