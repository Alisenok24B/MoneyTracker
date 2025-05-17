import { ICreditCardDetails } from "@moneytracker/interfaces";

export namespace CreditCreate {
    export const topic = 'credit.create.command';
    export class Request {
      accountId: string;
      details: ICreditCardDetails;
    }
    export class Response {}
  }