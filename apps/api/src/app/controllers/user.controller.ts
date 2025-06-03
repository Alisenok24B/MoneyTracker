import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';
import { RMQService } from 'nestjs-rmq';
import { AccountUserInfo, AccountChangeProfile, UserSearch } from '@moneytracker/contracts';
import { ChangeProfileDto } from '../dtos/change-profile.dto';
import { SearchUserDto } from '../dtos/search-user.dto';

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

  @UseGuards(JWTAuthGuard)
  @Post('search')
  async search(
    @UserId() _userId: string,          // нужен только для проверки авторизации
    @Body() dto: SearchUserDto,
  ) {
    return this.rmqService.send<UserSearch.Request, UserSearch.Response>(
      UserSearch.topic,
      {
        query: dto.query,
        limit: dto.limit,
      },
    );
  }
}
