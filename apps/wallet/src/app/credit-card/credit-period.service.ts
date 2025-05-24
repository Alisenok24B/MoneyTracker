import { Injectable } from '@nestjs/common';
import { CreditPeriodRepository }    from './repositories/credit-period.repository';
import { CreditTxIndexRepository }   from './repositories/credit-tx-index.repository';
import { CreditCycleCalculator }     from './credit-cycle-calculator.service';
import { CreditRepository }          from './repositories/credit-card.repository';
import { CreditPeriodEntity, FlowType } from './entities/credit-period.entity';
import { ICreditCardDetails }        from '@moneytracker/interfaces';

@Injectable()
export class CreditPeriodService {
  constructor(
    private readonly periods:     CreditPeriodRepository,
    private readonly index:       CreditTxIndexRepository,
    private readonly calc:        CreditCycleCalculator,
    private readonly detailsRepo: CreditRepository,   // используется listener-ом
  ) {}

  /** гарантирует, что у счёта есть «живой» период */
  async ensurePeriod(
    accountId: string,
    today: Date = new Date(),
  ): Promise<CreditPeriodEntity> {

    const open = await this.periods.findOpenByAccount(accountId);
    if (open && today >= open.statementStart && today <= open.paymentDue) {
      return open;
    }

    const detDoc = await this.detailsRepo.findByAccountId(accountId);
    if (!detDoc) throw new Error('credit details missing');

    const det = detDoc.toObject() as unknown as ICreditCardDetails;

    const win =
      det.billingCycleType === 'fixed'
        ? this.calc.getFixedWindow(det.statementAnchor!, det)
        : det.billingCycleType === 'calendar'
        ? this.calc.getCalendarWindow(today, det)
        : this.calc.getPerPurchaseWindow(today, det);

    const next = new CreditPeriodEntity({
      accountId,
      ...win,
      status:
        today <= win.statementEnd ? 'open'
        : today <= win.paymentDue  ? 'payment'
        : 'overdue',
      totalSpent:       0,
      paidAmount:       0,
      interestAccrued:  0,
    }).markCreated();

    return this.periods.create(next);
  }

  /* ---------- учёт транзакций ---------- */

  async registerTransaction(p: {
    txId: string; accountId: string; amount: number;
    flow: FlowType; date: Date;
  }) {
    const period = await this.ensurePeriod(p.accountId, p.date);

    if (p.flow === 'expense') period.addExpense(p.amount).markUpdated();
    else                      period.addPayment(p.amount).markUpdated();

    await this.periods.update(period);
    await this.index.create({
      txId: p.txId,
      accountId: p.accountId,
      periodId:  period._id!,
      flow:      p.flow,
      amount:    p.amount,
      date:      p.date,
    });
  }

  async updateTransaction(txId: string, patch: {
    accountId: string; date: Date; amount: number; flow: FlowType;
  }) {
    const idx = await this.index.findByTxId(txId);
    if (!idx) {
      return this.registerTransaction({ txId, ...patch });
    }

    /* 1) откат из прежнего периода */
    const prev = await this.periods.findById(idx.periodId);
    if (prev) {
      if (idx.flow === 'expense') prev.totalSpent -= idx.amount;
      else                        prev.paidAmount -= idx.amount;
      await this.periods.update(prev.markUpdated());
    }

    /* 2) запись в новый */
    const next = await this.ensurePeriod(patch.accountId, patch.date);
    if (patch.flow === 'expense') next.totalSpent += patch.amount;
    else                          next.paidAmount += patch.amount;
    await this.periods.update(next.markUpdated());

    /* 3) патч индекса */
    await this.index.update(txId, {
      accountId: patch.accountId,
      periodId:  next._id!,
      flow:      patch.flow,
      amount:    patch.amount,
      date:      patch.date,
    });
  }

  async initForAccount(accountId: string, today: Date = new Date()): Promise<void> {
    const detDoc = await this.detailsRepo.findByAccountId(accountId);
    if (!detDoc) return;                       // детали уже удалены → нечего инициализировать
    await this.ensurePeriod(accountId, today); // создаст первый/текущий период, если нужно
  }
}