import { Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { CreditPeriodService } from './credit-period.service';

type FlowType = 'expense' | 'income';

/** структура event-сообщений, которые эмитит TransactionEntity */
interface TxEventPayload {
  transactionId: string;
  accountId: string;
  type: 'expense' | 'income' | 'transfer';
  amount: number;
  date: string;
}

const CREATED_TOPIC = 'transaction.created.event';
const UPDATED_TOPIC = 'transaction.updated.event';

@Controller()
export class TransactionListener {
  constructor(private readonly svc: CreditPeriodService) {}

  // -------------------------------------------------------
  // helper — переводим из полного типа в FlowType
  private toFlow(t: TxEventPayload['type']): FlowType {
    return t === 'expense' ? 'expense' : 'income';
  }

  /** обработка нового tx */
  @RMQValidate()
  @RMQRoute(CREATED_TOPIC)
  async onCreated(msg: TxEventPayload) {
    if (msg.type === 'transfer') return;

    await this.svc.registerTransaction({
      txId: msg.transactionId,
      accountId: msg.accountId,
      flow: this.toFlow(msg.type),
      amount: msg.amount,
      date: new Date(msg.date),
    });
  }

  /** обработка изменения tx */
  @RMQValidate()
  @RMQRoute(UPDATED_TOPIC)
  async onUpdated(msg: TxEventPayload) {
    if (msg.type === 'transfer') return;

    await this.svc.updateTransaction(msg.transactionId, {
      accountId: msg.accountId,
      flow: this.toFlow(msg.type),
      amount: msg.amount,
      date: new Date(msg.date),
    });
  }
}