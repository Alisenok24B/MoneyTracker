export namespace CreditPeriodGet {
    export const topic = 'credit.period.get.query';
    export class Request { accountId!: string; periodId!: string; }
    export class Response {
      period!: {
        _id: string;
        accountId: string;
        statementStart: string; // ISO-date
        statementEnd:   string; // ISO-date
        paymentDue:     string; // ISO-date
        status: 'open'|'payment'|'overdue'|'closed';
      };
    }
  }