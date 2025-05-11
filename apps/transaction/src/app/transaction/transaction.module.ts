import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RMQModule } from 'nestjs-rmq';
import { Transaction, TransactionSchema } from './models/transaction.model';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionService } from './transaction.service';
import { TransactionCommands } from './transaction.commands';
import { TransactionQueries } from './transaction.queries';
import { TransactionEventEmitter } from './transaction.event-emitter';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
  ],
  providers: [
    TransactionRepository,
    TransactionService,
    TransactionEventEmitter,
  ],
  controllers: [
    TransactionCommands,
    TransactionQueries,
  ],
  exports: [TransactionService],
})
export class TransactionModule {}
