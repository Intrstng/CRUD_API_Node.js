import {UncorrectPropertiesError, UserNotFoundError} from './errors';
import {NewUserType, UserDataType, UserType} from './data';
import { v4 } from 'uuid';
const { newUserPropertiesValidation } = require('./utils');

let data = require('./data');

class Controller {
    async getUsers(): Promise<UserDataType> {
        return new Promise((resolve, _) => resolve(data));
    }
    async getUser(id: string): Promise<UserType | string> {
        return new Promise((resolve, reject) => {
            let user: UserType = data.find((u: UserType) => u.id === id);
            if (user) {
                resolve(user)
            } else {
                reject(new UserNotFoundError(id));
            }
        });
    }
    async deleteUser(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const userIndex: number = data.findIndex((u: UserType) => u.id === id);
            if (userIndex === -1) {
                reject(new UserNotFoundError(id));
            }
            data.splice(userIndex, 1);
            resolve();
            //resolve(`User with ${id} deleted successfully`);
        });
    }
    async createUser(user: NewUserType): Promise<UserType> {
        try {
            newUserPropertiesValidation(user);
            let newUser: UserType = {
                id: v4(),
                ...user
            }
            data = [...data, newUser];
            return newUser;
        } catch (error) {
            throw error;
        }
    }
    async updateUser(id: any, userData: NewUserType): Promise<UserType> {
        return new Promise((resolve, reject) => {
            let user = data.find((u: UserType) => u.id === id);
            if (!user) {
                reject(new UserNotFoundError(id));
            }
            newUserPropertiesValidation(user);
            const updatedUser = { id, ...userData };
            data = data.map((el: UserType) => el.id === id ? updatedUser : el)

            resolve(updatedUser);


        });
    }
}

module.exports = Controller;