import { Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  TransactionCreate,        // событие «создана»
  TransactionUpdate,        // событие «обновлена»
} from '@moneytracker/contracts';
import { AccountRepository } from '../account/repositories/account.repository';
import { AccountType } from '@moneytracker/interfaces';
import { CreditPeriodService } from './credit-period.service';
import { FlowType } from './entities/credit-period.entity';

// RMQ topics:
const CREATED = 'transaction.created.event';
const UPDATED = 'transaction.updated.event';

type TxMsg = {
  _id:        string;      // id транзакции
  accountId?: string;
  toAccountId?: string;
  amount:     number;
  type:       'income' | 'expense' | 'transfer';
  date:       string | Date;
};

@Controller()
export class TransactionListener {
  constructor(
    private readonly svc:      CreditPeriodService,
    private readonly accounts: AccountRepository,
  ) {}

  private async detectFlow(m: TxMsg): Promise<{ flow: FlowType; cardId: string } | null> {
    if (m.accountId) {
      const acc = await this.accounts.findByIdIncludeDeleted(m.accountId);
      if (acc?.type === AccountType.CreditCard) return { flow: 'expense', cardId: acc._id.toString() };
    }
    if (m.toAccountId) {
      const acc = await this.accounts.findByIdIncludeDeleted(m.toAccountId);
      if (acc?.type === AccountType.CreditCard) return { flow: 'income', cardId: acc._id.toString() };
    }
    return null;
  }

  @RMQValidate()
  @RMQRoute(CREATED)
  async onCreated(msg: TxMsg) {
    if (msg.type === 'transfer') return;
    const info = await this.detectFlow(msg);
    if (!info) return;

    await this.svc.registerTransaction({
      txId: msg._id,
      accountId: info.cardId,
      flow: info.flow,
      amount: msg.amount,
      date: new Date(msg.date),
    });
  }

  @RMQValidate()
  @RMQRoute(UPDATED)
  async onUpdated(msg: TxMsg) {
    if (msg.type === 'transfer') return;
    const info = await this.detectFlow(msg);
    if (!info) return;

    await this.svc.updateTransaction(msg._id, {
      accountId: info.cardId,
      flow: info.flow,
      amount: msg.amount,
      date: new Date(msg.date),
    });
  }
}