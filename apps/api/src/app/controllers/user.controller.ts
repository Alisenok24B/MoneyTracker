import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';
import { RMQService } from 'nestjs-rmq';
import { AccountUserInfo, AccountChangeProfile } from '@moneytracker/contracts';
import { ChangeProfileDto } from '../dtos/change-profile.dto';

@Controller('user')
export class UserController {
    constructor(private readonly rmqService: RMQService) {}

  @UseGuards(JWTAuthGuard)
  @Get('info')
  async info(@UserId() userId: string) {
    return this.rmqService.send<
      AccountUserInfo.Request,
      AccountUserInfo.Response
    >(AccountUserInfo.topic, { id: userId });
  }

  @UseGuards(JWTAuthGuard)
  @Post('change-profile')
  async changeProfile(
    @UserId() userId: string,
    @Body() dto: ChangeProfileDto,
  ) {
    return this.rmqService.send<
      AccountChangeProfile.Request,
      AccountChangeProfile.Response
    >(AccountChangeProfile.topic, {
      id: userId,
      user: { displayName: dto.displayName },
    });
  }
}
