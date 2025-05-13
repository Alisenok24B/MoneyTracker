// libs/contracts/src/lib/transaction/transaction.purge.ts
export namespace TransactionPurge {
    export const topic = 'transaction.purge.command';
    export class Request { userId!: string; id!: string; }
    export class Response {}
  }