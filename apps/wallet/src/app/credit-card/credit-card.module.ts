// apps/wallet-service/src/app/credit/credit.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule'
import { CreditDetailsSchema } from './models/credit-details.model';
import { CreditRepository } from './repositories/credit-card.repository';
import { CreditService } from './credit-card.service';
import { CreditController } from './credit-card.controller';
import { CreditEventEmitter } from './credit-card.event-emitter';
import { CreditPeriodService } from './credit-period.service';
import { CreditCycleCalculator } from './credit-cycle-calculator.service';
import { TransactionListener } from './transaction.listener';
import { CreditPeriodRepository } from './repositories/credit-period.repository';
import { CreditPeriodModel, CreditPeriodSchema } from './models/credit-period.model';
import { CreditTxIndex, CreditTxIndexSchema } from './models/credit-tx-index.model';
import { CreditTxIndexRepository } from './repositories/credit-tx-index.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'CreditDetails', schema: CreditDetailsSchema },
      { name: 'CreditPeriodModel', schema: CreditPeriodSchema },
      { name: 'CreditTxIndex', schema: CreditTxIndexSchema },
    ]),
    ScheduleModule.forRoot(),
  ],
  providers: [CreditRepository, 
    CreditService, 
    CreditEventEmitter, 
    CreditPeriodRepository, 
    CreditCycleCalculator, 
    CreditPeriodService,
    TransactionListener,
    CreditTxIndexRepository
  ],
  controllers: [CreditController],
  exports: [CreditService, CreditPeriodService], // чтобы AccountModule мог инжектить
})
export class CreditCardModule {}