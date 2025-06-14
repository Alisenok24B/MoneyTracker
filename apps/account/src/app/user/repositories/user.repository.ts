import { Model } from "mongoose";
import { User } from "../models/user.model";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "../entities/user.entity";

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) {}

    async createUser(user: UserEntity) {
        const newUser = new this.userModel(user);
        return newUser.save();
    }

    async updateUser(user: UserEntity) {
        const {_id, ...rest} = user;
        return this.userModel.updateOne({_id}, {$set: {...rest}}).exec();
    }

    async findUser(email: string) {
        return this.userModel.findOne({email}).exec();
    }

    async findUserById(id: string) {
        return this.userModel.findById(id).exec();
    }

    async deleteUser(email: string) {
        this.userModel.deleteOne({email}).exec();
    }

    async searchByEmail(substr: string, limit = 10) {
        return this.userModel
            .find({ email: { $regex: substr, $options: 'i' } })
            .limit(limit)
            .lean()
            .exec();
    }
}