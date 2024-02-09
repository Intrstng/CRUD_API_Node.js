import {UserNotFoundError} from './errors';
import {UserDataType, UserType} from './data';
import { v4 } from 'uuid';

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
}

module.exports = Controller;