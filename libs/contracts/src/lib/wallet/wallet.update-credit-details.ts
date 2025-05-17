export namespace CreditUpdateLimit {
    export const topic = 'credit.update-limit.command';
    export class Request {
      accountId: string;
      creditLimit: number;
    }
    export class Response {}
}