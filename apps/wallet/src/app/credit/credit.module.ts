import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreditPeriod, CreditPeriodSchema } from './models/credit-period.model';
import { CreditRepository } from './repositories/credit.repository';
import { CreditService } from './credit.service';
import { CreditEventHandler } from './credit.event-handler';
import { CreditCommands } from './credit.commands';
import { CreditQueries } from './credit.queries';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CreditPeriod.name, schema: CreditPeriodSchema }])
  ],
  providers: [CreditRepository, CreditService],
  controllers: [CreditEventHandler, CreditCommands, CreditQueries],
  exports: [CreditService, CreditRepository],
})
export class CreditModule {}