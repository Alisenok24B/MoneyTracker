import { BadRequestException, Controller, ForbiddenException, Get, Param, UseGuards } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { JWTAuthGuard } from '../guards/jwt.guard';
import {
    AccountGet,
  CreditPeriodsDebts,
} from '@moneytracker/contracts';
import { UserId } from '../guards/user.decorator';
import { AccountType } from '@moneytracker/interfaces';
import { PeersHelper } from '../helpers/peer.helper';

@Controller('credit-cards')
export class CreditPeriodController {
  constructor(
    private readonly rmq: RMQService,
    private readonly peersHelper: PeersHelper,
  ) {}

  @UseGuards(JWTAuthGuard)
  @Get(':accountId/periods/debts')
  async listDebts(
    @Param('accountId') accountId: string,
    @UserId() userId: string,
  ) {
    const peers = await this.peersHelper.getPeers(userId);
    // 1) проверяем, что счёт действительно принадлежит пользователю
    const { account } = await this.rmq.send<
      AccountGet.Request,
      AccountGet.Response
    >(AccountGet.topic, { userId, id: accountId, peers });
    const allowedUsers = new Set([userId, ...peers]);
  if (!allowedUsers.has(account.userId)) {
    throw new ForbiddenException('Access denied to this account');
  }

    // 2) проверяем, что это именно кредитная карта
    if (account.type !== AccountType.CreditCard) {
        throw new BadRequestException('Account is not a credit card');
      }

    // 2) запрашиваем у кредитного модуля список долгов
    const { debts } = await this.rmq.send<
      CreditPeriodsDebts.Request,
      CreditPeriodsDebts.Response
    >(CreditPeriodsDebts.topic, { accountId });

    return { debts };
  }
}