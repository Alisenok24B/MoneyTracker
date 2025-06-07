import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  formatISO,
  isAfter,
  isBefore,
} from 'date-fns';

import { CreditPeriodRepository }       from './repositories/credit-period.repository';
import { CreditTxIndexRepository }      from './repositories/credit-tx-index.repository';
import { CreditRepository }             from './repositories/credit-card.repository';
import { CreditCycleCalculator }        from './credit-cycle-calculator.service';
import { CreditPeriodEntity, FlowType } from './entities/credit-period.entity';

@Injectable()
export class CreditPeriodService {
  private readonly log = new Logger(CreditPeriodService.name);

  constructor(
    private readonly periods:      CreditPeriodRepository,
    private readonly index:        CreditTxIndexRepository,
    private readonly calc:         CreditCycleCalculator,
    private readonly creditRepo:   CreditRepository,
  ) {}

  /* ------------------------------------------------------------------
   * INITIALISATION
   * ---------------------------------------------------------------- */
  /**
   * Вызывается из AccountService сразу после создания кредитного счёта.
   * Заводит «живой» кредит-период, если его ещё нет.
   */
  async initForAccount(accountId: string, today = new Date()) {
    await this.ensurePeriod(accountId, today);
  }

  /* ------------------------------------------------------------------
   * CORE
   * ---------------------------------------------------------------- */
  /**
   * Гарантирует, что на дату *today* для счёта существует открытый / платёжный
   * период и возвращает его.
   */
  async ensurePeriod(accountId: string, today = new Date()): Promise<CreditPeriodEntity> {
    // 0) Попробовать найти ПЕРИОД, охватывающий именно дату «today» (любой статус, даже closed)
    const existingByDate = await this.periods.findByDate(accountId, today);
    if (existingByDate) {
      // если он был closed, переводим в overdue
      if (existingByDate.status === 'closed') {
        existingByDate.status = 'overdue';
        existingByDate.markUpdated();
        await this.periods.update(existingByDate);
      }
      return existingByDate;
    }

    // 1) Ничего не найдено — заводим новый период
    const details = await this.creditRepo.findByAccountId(accountId);
    if (!details) throw new Error(`Credit details for account ${accountId} not found`);

    // вычисляем окно по типу цикла
    const win =
      details.billingCycleType === 'fixed'
        ? this.calc.getFixedWindow(new Date(details.statementAnchor), details)
        : details.billingCycleType === 'calendar'
        ? this.calc.getCalendarWindow(today, details)
        : this.calc.getPerPurchaseWindow(today, details);

    const status =
      isBefore(today, win.statementEnd)
        ? 'open'
        : isAfter(today, win.paymentDue)
        ? 'overdue'
        : 'payment';

    const entity = new CreditPeriodEntity({
      accountId,
      ...win,
      status,
      totalSpent: 0,
      paidAmount: 0,
      interestAccrued: 0,
      interestRate: details.interestRate,
    }).markCreated();

    return this.periods.create(entity);
  }


  /* ------------------------------------------------------------------
   *  ТРАНЗАКЦИИ
   * ---------------------------------------------------------------- */

  /** Учитываем новую транзакцию (income / expense) */
  async registerTransaction(args: {
    txId: string;
    accountId: string;
    amount: number;
    flow: FlowType;          // 'income' | 'expense'
    date: Date;
    periodId?: string;
    hasInterest?: boolean;
  }): Promise<void> {
    let period: CreditPeriodEntity;

    if (args.periodId) {
      // 1) Берём указанный период и проверяем
      const p = await this.periods.findById(args.periodId);
      if (!p || p.accountId !== args.accountId) {
        throw new Error(`Credit period ${args.periodId} not found for account ${args.accountId}`);
      }
      period = p;
    } else {
      // 2) Обычный auto-period
      period = await this.ensurePeriod(args.accountId, args.date);
    }

    // 1) Сохраняем сумму
    if (args.flow === 'expense') {
      period.addExpense(args.amount);
    } else {
      period.addPayment(args.amount);
    }
    // 2) Если hasInterest — закрываем период, иначе просто помечаем его обновлённым
    if (args.hasInterest) {
      period.status = 'closed';
      period.hasInterest = true;
    }
    period.markUpdated();
    await this.periods.update(period);

    await this.index.create({
      txId:      args.txId,
      periodId:  period._id!,
      accountId: args.accountId,
      flow:      args.flow,
      amount:    args.amount,
      date:      args.date,
    });

  // 5) Дополнительная проверка для income без hasInterest:
  // если пополнение (flow='income'), период в payment|overdue
  // и дата внутри [statementEnd..paymentDue],
  // то при долге = 0 автоматически закрываем период.
  if (
    !args.hasInterest &&
    args.flow === 'income' &&
    (period.status === 'payment' || period.status === 'overdue')
  ) {
    const stmtEnd = period.statementStart;
    const payDue  = period.paymentDue;
    if (args.date >= stmtEnd && args.date <= payDue) {
      const debt = await this.calculateDebt(period._id!);
      if (debt === 0) {
        period.status = 'closed';
        period.markUpdated();
        await this.periods.update(period);
      }
    }
  }
}

  /** Обрабатываем изменение транзакции */
  async updateTransaction(
    txId: string,
    patch: { accountId: string; date: Date; amount: number; flow: FlowType },
  ): Promise<void> {
    const idx = await this.index.findByTxId(txId);

    // если раньше не индексировали (например, старая «transfer» стала expense)
    if (!idx) {
      await this.registerTransaction({ txId, ...patch });
      return;
    }

    /* ---- 1. Откатываем влияние из старого периода --------------------- */
    const old = await this.periods.findById(idx.periodId);
    if (old) {
      if (idx.flow === 'expense') old.totalSpent -= idx.amount;
      else                        old.paidAmount -= idx.amount;
      old.markUpdated();
      await this.periods.update(old);
    }

    /* ---- 2. Применяем к (возможно новому) периоду ---------------------- */
    const period = await this.ensurePeriod(patch.accountId, patch.date);
    if (patch.flow === 'expense') period.totalSpent += patch.amount;
    else                          period.paidAmount += patch.amount;
    period.markUpdated();
    await this.periods.update(period);

    /* ---- 3. Патчим индекс --------------------------------------------- */
    await this.index.update(txId, {
      periodId:  period._id!,
      accountId: patch.accountId,
      flow:      patch.flow,
      amount:    patch.amount,
      date:      patch.date,
    });
  }

  /**
   * Считает задолженность по одному периоду:
   * expense → +amount, income → -amount
   */
  async calculateDebt(periodId: string): Promise<number> {
    const entries = await this.index.findByPeriodId(periodId);
    return entries.reduce((sum, idx) => {
      return sum + (idx.flow === 'expense' ? idx.amount : -idx.amount);
    }, 0);
  }

  /** Возвращает периоды с долгами > 0 и их диапазон дат */
  async listOutstandingDebts(
    accountId: string
  ): Promise<
    { periodId: string; debt: number; statementStart: string; paymentDue: string; status: string }[]
  > {
    // 1) все периоды payment|overdue
    const periods = await this.periods.findMany({ accountId });
    const relevant = periods.filter(
      p => p.status === 'payment' || p.status === 'overdue'
    );

    const result: {
      periodId: string;
      debt: number;
      statementStart: string;
      paymentDue: string;
      status: string;
    }[] = [];

    for (const p of relevant) {
      const debt = await this.calculateDebt(p._id!);
      if (debt > 0) {
        // форматируем даты YYYY-MM-DD
        const start = formatISO(p.statementStart, { representation: 'date' });
        const due   = formatISO(p.paymentDue,   { representation: 'date' });
        result.push({
          periodId:       p._id!,
          debt,
          statementStart: start,
          paymentDue:     due,
          status: p.status
        });
      }
    }
    return result;
  }

  /**
   * Возвращает один период по его id (или бросает, если не найден или чужой)
   */
  async getPeriod(accountId: string, periodId: string) {
    const ent = await this.periods.findById(periodId);
    if (!ent || ent.accountId !== accountId) {
      throw new NotFoundException('Credit period not found for this account');
    }
    return {
      _id:            ent._id!,
      accountId:      ent.accountId,
      statementStart: ent.statementStart.toISOString().slice(0, 10),
      statementEnd:   ent.statementEnd.toISOString().slice(0, 10),
      paymentDue:     ent.paymentDue.toISOString().slice(0, 10),
      status:         ent.status,
    };
  }

  /**
   * Считает общий долг по всем кредитным периодам данного accountId,
   * у которых status = "open" | "payment" | "overdue".
   */
  async calculateTotalDebt(accountId: string): Promise<number> {
    // Берём только те периоды, у которых статус в [open, payment, overdue]
    // и где accountId совпадает.
    const relevant: CreditPeriodEntity[] = await this.periods.findActiveByAccount(accountId);

    let total = 0;
    for (const period of relevant) {
      const debt = await this.calculateDebt(period._id!);
      total += debt > 0 ? debt : 0;
    }
    return total;
  }

  /**
   * Возвращает «свободный» остаток по кредитке: creditLimit − текущий долг.
   * Если кредитные детали не найдены — кидаем ошибку.
   */
  async getAvailableCredit(accountId: string): Promise<number> {
    const detailsDoc = await this.creditRepo.findByAccountId(accountId);
    if (!detailsDoc) {
      throw new Error(`Credit details not found for account ${accountId}`);
    }
    const creditLimit = detailsDoc.creditLimit;
    const totalDebt   = await this.calculateTotalDebt(accountId);
    return creditLimit - totalDebt;
  }

  /* ------------------------------------------------------------------
   *  CRON-JOB
   *  — выполняется ежедневно в 00:00, закрывает периоды
   *    и начисляет проценты по просрочке
   * ---------------------------------------------------------------- */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) //'*/1 * * * *'
  async nightlyRecalc(): Promise<void> {
    const today = new Date();
    this.log.log('⏰ Nightly credit-cycle recalc');

    const open = await this.periods.findAllOpen();   // ← метод теперь без обязательного id
    for (const p of open) {
      let changed = false;

      if (p.status === 'open' && today > p.statementEnd) {
        p.status = 'payment'; changed = true;
      }
      if (p.status === 'payment' && today > p.paymentDue) {
        p.status = 'overdue';
        p.hasInterest = true;
        changed = true;
      }
      if (p.status === 'overdue') {
        const unpaid = p.totalSpent - p.paidAmount;
        if (unpaid > 0) {
          p.interestAccrued += unpaid * (p.interestRate / 36500);
          changed = true;
        }
      }
      if (changed) {
        p.markUpdated();
        await this.periods.update(p);
      }
    }
  }
}