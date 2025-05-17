import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './models/account.model';
import { AccountService } from './account.service';
import { AccountRepository } from './repositories/account.repository';
import { AccountCommands } from './account.commands';
import { AccountQueries } from './account.queries';
import { AccountEventEmitter } from './account.event-emitter';
import { CreditCardModule } from '../credit-card/credit-card.module';

@Module({
  imports: [
    MongooseModule.forFeature([ { name: Account.name, schema: AccountSchema } ]),
    CreditCardModule
  ],
  providers: [ AccountService, AccountRepository, AccountEventEmitter ],
  controllers: [ AccountCommands, AccountQueries ],
  exports: [ AccountService, AccountRepository ],
})
export class AccountModule {}