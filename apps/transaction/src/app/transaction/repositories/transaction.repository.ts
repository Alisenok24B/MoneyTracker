// apps/transactions/src/app/transactions/repositories/transaction.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../models/transaction.model';
import { TransactionEntity } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>
  ) {}

  /** Сохраняет новую транзакцию из доменной сущности и возвращает сохранённую сущность */
  async create(entity: TransactionEntity): Promise<TransactionEntity> {
    const doc = new this.transactionModel(entity);
    const saved = await doc.save();
    return new TransactionEntity(saved.toObject());
  }

  /** Находит все транзакции по списку идентификаторов счетов и возвращает их доменные сущности */
  async findByAccountIds(accountIds: string[]): Promise<TransactionEntity[]> {
    const docs = await this.transactionModel
      .find({ accountId: { $in: accountIds } })
      .lean()
      .exec();
    return docs.map(d => new TransactionEntity({ ...d, _id: d._id.toString() }));
  }

  /**
   * Возвращает все транзакции, где счёт фигурирует
   *   – либо как accountId   (списание / исход перевод),
   *   – либо как toAccountId (поступление перевода).
   */
  async findByAccountOrToAccountIds(accountIds: string[]): Promise<TransactionEntity[]> {
    const docs = await this.transactionModel
      .find({
        $or: [
          { accountId:   { $in: accountIds } },
          { toAccountId: { $in: accountIds } },
        ],
      })
      .lean()
      .exec();

    return docs.map(
      d => new TransactionEntity({ ...d, _id: d._id.toString() }),
    );
  }

  /** Находит одну транзакцию по ID и конвертирует в доменную сущность */
  async findById(id: string): Promise<TransactionEntity | null> {
    const doc = await this.transactionModel.findById(id).exec();
    if (!doc) return null;
    return new TransactionEntity(doc.toObject());
  }

  /** Обновляет транзакцию на основе полной доменной сущности, возвращает новую сущность */
  async update(entity: TransactionEntity): Promise<TransactionEntity> {
    const { _id, ...rest } = entity;
    await this.transactionModel.updateOne({ _id }, { $set: rest }).exec();
    const updated = await this.transactionModel.findById(_id).exec();
    if (!updated) throw new Error(`Transaction ${_id} not found after update`);
    return new TransactionEntity(updated.toObject());
  }

  /** Soft-delete по доменной сущности (использует её deletedAt) */
  async softDelete(entity: TransactionEntity): Promise<void> {
    await this.transactionModel
      .updateOne({ _id: entity._id }, { $set: { deletedAt: entity.deletedAt } })
      .exec();
  }

  async hardDelete(id: string): Promise<void> {
    await this.transactionModel.deleteOne({ _id: id }).exec();
  }
}
