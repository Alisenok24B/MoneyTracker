import { Body, Controller } from "@nestjs/common";
import { AccountUserInfo, UserSearch } from "@moneytracker/contracts";
import { RMQRoute, RMQValidate } from "nestjs-rmq";
import { UserRepository } from "./repositories/user.repository";
import { UserEntity } from "./entities/user.entity";

@Controller()
export class UserQueries {
    constructor(private readonly userRepository: UserRepository) {}

    @RMQValidate()
    @RMQRoute(AccountUserInfo.topic)
    async userInfo(@Body() {id}: AccountUserInfo.Request): Promise<AccountUserInfo.Response> {
        const user = await this.userRepository.findUserById(id);
        const profile = new UserEntity(user).getPublicProfile();
        return { profile };
    }

    @RMQValidate()
    @RMQRoute(UserSearch.topic)
    async search(
        @Body() dto: UserSearch.Request,
    ): Promise<UserSearch.Response> {
        const docs = await this.userRepository.searchByEmail(dto.query, dto.limit);
        const users = docs.map(d => {
        const ent = new UserEntity(d);
        const profile = ent.getPublicProfile();
        return {
            id: d._id.toString(),
            email: d.email,
            displayName: profile.displayName,
        };
        });
        return { users };
    }
}