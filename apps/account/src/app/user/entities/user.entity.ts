import { IDomainEvent, IUser } from "@moneytracker/interfaces";
import { compare, genSalt, hash } from "bcryptjs";

export class UserEntity implements IUser {
    _id?: string;
    displayName: string;
    email: string;
    passwordHash: string;
    events: IDomainEvent[] = [];

    constructor(user: IUser) {
      this._id = user._id;
      this.displayName = user.displayName;
      this.passwordHash = user.passwordHash;
      this.email = user.email;
    }

    public getPublicProfile() {
        return {
            email: this.email,
            displayName: this.displayName
        }
    }

    public async setPassword(password: string) {
        const salt = await genSalt(10);
        this.passwordHash = await hash(password, salt);
        return this;
    }

    public validatePassword(password: string) {
        return compare(password, this.passwordHash);
    }

    public updateProfile(displayName: string) {
        this.displayName = displayName;
        return this;
    }
}