import { AccountChangeProfile } from '@moneytracker/contracts';
import { IUser } from '@moneytracker/interfaces';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserEventEmmiter } from './user.event-immiter';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository,
        private readonly userEventEmmiter: UserEventEmmiter
    ) {}

    async changeProfile(user: Pick<IUser, 'displayName'>, id: string): Promise<AccountChangeProfile.Response> {
        const existedUser = await this.userRepository.findUserById(id);
        if (!existedUser) {
            throw new Error('Такого пользователя не существует');
        }
        const userEntity = new UserEntity(existedUser).updateProfile(user.displayName);
        await this.updateUser(userEntity);
        return {};
    }

    private updateUser(user: UserEntity) {
        return Promise.all([
            this.userEventEmmiter.handle(user),
            this.userRepository.updateUser(user)
        ])
    }
}
