import UserModel from "../models/UserModel"
import { User } from "../types"
import argon2 from 'argon2';

export const signup = async(user: User) => {
    const userExists = await UserModel.findOne({
        where: {
            email: user.email
        }
    });
    console.log(userExists);
    if(userExists){
        return true;
    }
    const encryptedPassword = await argon2.hash(user.password);
    await UserModel.create({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: encryptedPassword,
        avatarURI: user.avatarURI
    });
    return null;
}