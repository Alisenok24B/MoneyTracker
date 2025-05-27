export namespace CreditPeriodsDebts {
    export const topic = 'credit.period.debts.query';
  
    export class Request {
      accountId!: string;
    }
  
    export class Response {
      debts!: { periodId: string; debt: number }[];
    }
  }