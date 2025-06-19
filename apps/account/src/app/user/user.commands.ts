import { Body, Controller } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { AccountChangeProfile } from "@moneytracker/contracts";
import { RMQRoute, RMQValidate } from "nestjs-rmq";
import { UserEntity } from "./entities/user.entity";
import { UserService } from "./user.service";


@Controller()
export class UserCommands {
    constructor(private readonly userService: UserService) {}

    @RMQValidate()
    @RMQRoute(AccountChangeProfile.topic)
    async changeProfile(@Body() {user, id, peers}: AccountChangeProfile.Request): Promise<AccountChangeProfile.Response> {
        return this.userService.changeProfile(user, id, peers);
    }
}