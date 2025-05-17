// apps/wallet-service/src/app/credit/credit.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreditDetailsSchema } from './models/credit-details.model';
import { CreditRepository } from './repositories/credit-card.repository';
import { CreditService } from './credit-card.service';
import { CreditController } from './credit-card.controller';
import { CreditEventEmitter } from './credit-card.event-emitter';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'CreditDetails', schema: CreditDetailsSchema },
    ]),
  ],
  providers: [CreditRepository, CreditService, CreditEventEmitter],
  controllers: [CreditController],
  exports: [CreditService], // чтобы AccountModule мог инжектить
})
export class CreditCardModule {}