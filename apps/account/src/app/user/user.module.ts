import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.model';
import { UserRepository } from './repositories/user.repository';
import { UserCommands } from './user.commands';
import { UserQueries } from './user.queries';
import { UserService } from './user.service';
import { UserEventEmmiter } from './user.event-immiter';

@Module({
    imports: [MongooseModule.forFeature([
        {name: User.name, schema: UserSchema}
    ])],
    providers: [
        UserRepository,
        UserService,
        UserEventEmmiter
    ],
    exports: [
        UserRepository,
        UserService
    ],
    controllers: [UserCommands, UserQueries]
})
export class UserModule {}
