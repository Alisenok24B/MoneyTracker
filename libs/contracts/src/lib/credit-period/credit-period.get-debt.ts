export namespace CreditPeriodDebt {
    export const topic = 'credit.period.debt.query';
    export class Request { periodId!: string; }
    export class Response { debt!: number; }
  }