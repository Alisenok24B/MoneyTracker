import { Injectable, NotFoundException } from '@nestjs/common';
import { CreditRepository } from './repositories/credit-card.repository';
import { CreditDetails } from './entities/credit-details.vo';

@Injectable()
export class CreditService {
  constructor(private readonly repo: CreditRepository) {}

  async createForAccount(accountId: string, dto: any): Promise<void> {
    const vo = new CreditDetails(
      dto.creditLimit,                           // 1. limit
      dto.billingCycleType,                      // 2. billingCycleType
      dto.paymentPeriodDays,                     // 3. paymentPeriodDays
      dto.interestRate,                          // 4. interestRate
      dto.gracePeriodDays,                       // 5. gracePeriodDays (optional)
      dto.annualFee,
      dto.cashWithdrawalFeePercent,
      dto.cashWithdrawalFeeFixed,
      dto.cashWithdrawalLimitPerMonth,
      dto.statementAnchor ? new Date(dto.statementAnchor) : undefined,
    );
    await this.repo.create(accountId, vo);
  }

  async getDetailsByAccountId(accountId: string): Promise<CreditDetails> {
    const details = await this.repo.findByAccountId(accountId);
    if (!details) throw new NotFoundException('credit details not found');
    const o = details.toObject();
    return new CreditDetails(
      o.creditLimit,
      o.billingCycleType,
      o.paymentPeriodDays,
      o.interestRate,
      o.gracePeriodDays,
      o.annualFee,
      o.cashWithdrawalFeePercent,
      o.cashWithdrawalFeeFixed,
      o.cashWithdrawalLimitPerMonth,
      o.statementAnchor,
    );
  }

  async updateCreditLimit(accountId: string, newLimit: number): Promise<void> {
    await this.repo.updateLimit(accountId, newLimit);
  }

  /** Мягко удалить детали по accountId */
  async softDeleteByAccountId(accountId: string): Promise<void> {
    await this.repo.softDeleteByAccountId(accountId);
  }
}