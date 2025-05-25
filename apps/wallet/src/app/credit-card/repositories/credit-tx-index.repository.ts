import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreditTxIndex,
  CreditTxIndexDocument,
} from '../models/credit-tx-index.model';

/** Поток сделки внутри кредит-периода */
export type FlowType = 'income' | 'expense';

interface IndexPayload {
  txId: string;
  accountId: string;
  periodId: string;
  flow: FlowType;
  amount: number;
  date: Date;
}

@Injectable()
export class CreditTxIndexRepository {
  constructor(
    @InjectModel(CreditTxIndex.name)
    private readonly model: Model<CreditTxIndexDocument>,
  ) {}

  /** Создаём запись: один tx может фигурировать в нескольких аккаунтах (transfer) */
  async create(idx: IndexPayload): Promise<CreditTxIndexDocument> {
    const doc = new this.model(idx);
    return doc.save();
  }

  /** Обновляем все записи данного tx (при смене даты / суммы / периода) */
  async update(
    txId: string,
    patch: Omit<IndexPayload, 'txId'>,
  ): Promise<void> {
    await this.model.updateMany({ txId }, { $set: patch }).exec();
  }

  /** Один индекс (конкретный счёт) – для отката / перемещения */
  async findByTxIdAndAccount(
    txId: string,
    accountId: string,
  ): Promise<CreditTxIndexDocument | null> {
    return this.model.findOne({ txId, accountId }).exec();
  }

  /** Все индексы по транзакции (нужны для transfer) */
  async findAllByTxId(txId: string): Promise<CreditTxIndexDocument[]> {
    return this.model.find({ txId }).exec();
  }

  /** Получить первую запись по id транзакции (для update) */
  async findByTxId(txId: string): Promise<CreditTxIndexDocument | null> {
    return this.model.findOne({ txId }).exec();
  }

  /** Удаляем конкретную пару (tx, account) – используется при жёстком удалении tx */
  async remove(txId: string, accountId: string): Promise<void> {
    await this.model.deleteOne({ txId, accountId }).exec();
  }
}