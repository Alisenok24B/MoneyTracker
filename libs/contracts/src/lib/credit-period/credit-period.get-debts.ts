import { IsString } from "class-validator";

export namespace CreditPeriodsDebts {
    export const topic = 'credit.period.debts.query';
  
    export class Request {
      @IsString() accountId!: string;
    }
  
    export class DebtInfo {
      periodId!: string;
      debt!: number;
      statementStart!: string;  // "YYYY-MM-DD"
      statementEnd!: string;
      paymentDue!: string;      // "YYYY-MM-DD"
      status!: string;
    }
  
    export class Response {
      debts!: DebtInfo[];
    }
  }