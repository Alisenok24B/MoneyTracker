import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import {IUser} from '@moneytracker/interfaces'

export namespace AccountChangeProfile {
    export const topic = 'account.change-profile.command';

    export class Request {
        @IsString()
        id: string;

        @IsObject()
        user: Pick<IUser, 'displayName'>;
        @IsOptional() @IsArray() @IsString({ each:true }) peers?: string[];
    }

    export class Response {}
}
