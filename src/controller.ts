import {UserType} from './data';
import { v1 } from 'uuid';



let data = require('./data');

class Controller {
    async getUsers() {
        return new Promise((resolve, _) => resolve(data));
    }
}

module.exports = Controller;