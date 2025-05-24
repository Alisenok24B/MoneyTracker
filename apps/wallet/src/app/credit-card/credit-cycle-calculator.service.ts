import { Injectable } from '@nestjs/common';
import { ICreditCardDetails } from '@moneytracker/interfaces';

@Injectable()
export class CreditCycleCalculator {
  /* ――― fixed cycle ――― */
  getFixedWindow(anchor: Date, det: ICreditCardDetails) {
    const statementStart = new Date(anchor);
    const statementEnd   = new Date(anchor);
    statementEnd.setDate(statementEnd.getDate() + det.billingCycleLengthDays! - 1);

    const paymentDue = new Date(statementEnd);
    paymentDue.setDate(paymentDue.getDate() + det.paymentPeriodDays);

    return { statementStart, statementEnd, paymentDue };
  }

  /* ――― calendar month cycle ――― */
  getCalendarWindow(today: Date, det: ICreditCardDetails) {
    const y = today.getUTCFullYear();
    const m = today.getUTCMonth();
    const d = det.billingCycleStartDayOfMonth!;          // 1..31

    const statementStart = new Date(Date.UTC(y, m, d));
    if (today < statementStart) statementStart.setUTCMonth(m - 1); // ещё не начался

    const statementEnd = new Date(statementStart);
    statementEnd.setUTCMonth(statementEnd.getUTCMonth() + 1);
    statementEnd.setUTCDate(statementEnd.getUTCDate() - 1);

    const paymentDue = new Date(statementEnd);
    paymentDue.setDate(paymentDue.getDate() + det.paymentPeriodDays);

    return { statementStart, statementEnd, paymentDue };
  }

  /* ――― per-purchase ――― */
  getPerPurchaseWindow(date: Date, det: ICreditCardDetails) {
    const statementStart = new Date(date);
    const statementEnd   = new Date(date);
    statementEnd.setDate(statementEnd.getDate() + det.gracePeriodDays - 1);

    const paymentDue = new Date(statementEnd); // сразу после grace-period
    return { statementStart, statementEnd, paymentDue };
  }
}