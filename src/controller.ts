import {Error400, Error404, StatusCode, UncorrectPropertiesError, UserNotFoundError} from './errors';
import {UserDataType, UserType} from './data';
import {v4, validate} from 'uuid';
const { newUserPropertiesValidation } = require('./utils');

let data = require('./data');

interface IController {
    getUsers(): Promise<UserDataType>;
    getUser(id: string): Promise<UserType | string>;
    deleteUser(id: string): Promise<void>;
    createUser(user: UserType): Promise<UserType>;
    updateUser(id: any, userData: UserType): Promise<UserType>;
}

class Controller implements IController {
    // constructor() {
    //     throw new Error('Uncomment this to test 500 Internal Server Error');
    // }
    async getUsers(): Promise<UserDataType> {
        //throw new Error('Uncomment this to test 500 Internal Server Error');
        return new Promise((resolve, _) => resolve(data));
    }
    async getUser(id: string): Promise<UserType | string> {
        let user: UserType = data.find((u: UserType) => u.id === id);
        if (user) {
            return user;
        } else {
            throw new UserNotFoundError(id);
        }
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
    async createUser(user: UserType): Promise<UserType> {
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
    async updateUser(id: string, userData: UserType): Promise<UserType> {
        return new Promise((resolve, reject) => {
            let user = data.find((u: UserType) => u.id === id);
            if (!user) {
                reject(new UserNotFoundError(id));
            }
            const updatedUser = { id, ...userData };
            newUserPropertiesValidation(updatedUser);
            data = data.map((u: UserType) => u.id === id ? updatedUser : u)

            resolve(updatedUser);
        });
    }
}

module.exports = Controller;