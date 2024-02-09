import {UserNotFoundError} from './errors';

let data = require('./data');

class Controller {
    async getUsers() {
        return new Promise((resolve, _) => resolve(data));
    }
    async getUser(id: string) {
        return new Promise((resolve, reject) => {
            let user = data.find((u: any) => u.id === id);
            if (user) {
                resolve(user)
            } else {
                reject(new UserNotFoundError(id));
            }
        });
    }
}

module.exports = Controller;