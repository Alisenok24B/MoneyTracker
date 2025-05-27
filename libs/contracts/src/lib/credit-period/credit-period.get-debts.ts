export namespace CreditPeriodsDebts {
    export const topic = 'credit.period.debts.query';
  
    export class Request {
      accountId!: string;
    }
  
    export class DebtInfo {
      periodId!: string;
      debt!: number;
      statementStart!: string;  // "YYYY-MM-DD"
      paymentDue!: string;      // "YYYY-MM-DD"
    }
  
    export class Response {
      debts!: DebtInfo[];
    }
  }