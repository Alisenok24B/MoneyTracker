import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CreditRepository } from './repositories/credit.repository';
import { AccountService } from '../account/account.service';
import { IDomainEvent, ICreditCardDetails, AccountType } from '@moneytracker/interfaces';

@Injectable()
export class CreditService {
  private readonly logger = new Logger(CreditService.name);

  constructor(
    private readonly repo: CreditRepository,
    private readonly accountService: AccountService,
  ) {}

  async initializePeriod(accountId: string): Promise<void> {
    const account = await this.accountService.getAccount(accountId);
    if (account.type !== AccountType.CreditCard) return;

    const d = account.creditDetails!;
    if (!d.initialPeriodStartDate) {
        throw new BadRequestException('initialPeriodStartDate is required for CreditCard');
    }

    const now = new Date();
    // 1) старт берём из initialPeriodStartDate
    let start = new Date(d.initialPeriodStartDate);

    // 2) генерируем end в зависимости от типа:
    const makeEnd = (s: Date): Date => {
        if (d.billingCycleType === 'fixed') {
        const e = new Date(s);
        e.setDate(e.getDate() + (d.billingCycleLengthDays || 30) - 1);
        return e;
        }
        // calendar|perPurchase — считаем за календарный месяц
        return new Date(s.getFullYear(), s.getMonth() + 1, 0);
    };

    // 3) прокатываем период вплоть до того, который включает now
    let end = makeEnd(start);
    while (end < now) {
        start = new Date(end);
        start.setDate(start.getDate() + 1);
        end = makeEnd(start);
    }

    // 4) считаем дату платежа и статус
    const due = new Date(end);
    due.setDate(due.getDate() + d.paymentPeriodDays);
    const status: 'open' | 'due' | 'overdue' =
        now <= end ? 'open' : now <= due ? 'due' : 'overdue';

    // 5) upsert текущего периода
    await this.repo.upsertPeriod(accountId, {
        periodStart: start,
        periodEnd: end,
        paymentDue: due,
        status,
    });

    // 6) эмитим событие
    await this.events.emit([{
        topic: 'credit.period.calculated',
        data: { accountId, start, end, due, status }
    }]);
  }
}