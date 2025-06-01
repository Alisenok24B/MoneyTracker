export namespace CreditGetAvailable {
    export const topic = 'credit.get-available.query';
  
    export class Request {
      accountId: string;
    }
  
    export class Response {
      available: number;
    }
  }