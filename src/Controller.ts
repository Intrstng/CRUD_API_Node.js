import { v4, validate } from 'uuid';
import { Error400, StatusCode, UserNotFoundError } from './errors';
import { IncomingMessage, ServerResponse } from 'http';
import { UserDataType, UserType } from './data';
import { IController } from './data';
import { getReqData, newUserPropertiesValidation } from './utils/utils';

let data: UserDataType = [
    // {
    //     "id": "71bd1176-0be0-4a02-b559-e5b661320470",
    //     "username": "Tom",
    //     "age": 5,
    //     "hobbies": ["cycling", "fishing"],
    // },
    // {
    //     "id": "9fb9b44d-0c61-41f7-b1d7-12101a912dd9",
    //     "username": "Jerry",
    //     "age": 3,
    //     "hobbies": ["reading", "cooking"],
    // },
]


export class Controller implements IController {
    constructor(public req: IncomingMessage, public res: ServerResponse) {
        this.req = req
        this.res = res
    }

    async handleBadRequestError(id: string): Promise<void> {
        this.res.writeHead(StatusCode.BadRequest, { 'Content-Type': 'application/json' });
        this.res.end(JSON.stringify({ message: new Error400(id).message }));
    }

    async handleNotFoundError(error: Error): Promise<void> {
        this.res.writeHead(StatusCode.NotFound, {'Content-Type': 'application/json'});
        this.res.end(JSON.stringify({message: error.message}));
    }

    async handleSuccessRequest(users: UserType): Promise<void> {
        this.res.writeHead(StatusCode.OK, { 'Content-Type': 'application/json' });
        this.res.end(JSON.stringify(users));
    }

    async getUsers(): Promise<void> {
        // throw new Error('Test: you simulated error 500 Internal Server Error');
        new Promise((resolve, _) => resolve(data))
            .then(users => {
                this.res.writeHead(StatusCode.OK, { 'Content-Type': 'application/json' });
                this.res.end(JSON.stringify(users));
            });
    }

    async getUsersByID(id: string): Promise<void> {
        if (!validate(id)) {
            await this.handleBadRequestError(id);
            return;
        }
        let user: UserType | undefined = data.find((u: UserType) => u.id === id);
        if (user) {
            await this.handleSuccessRequest(user);
        } else {
            throw new UserNotFoundError(id);
        }
    }
    async deleteUserByID(id: string): Promise<void> {
        if (!validate(id)) {
            await this.handleBadRequestError(id);
            return;
        }
        const userIndex: number = data.findIndex((u: UserType) => u.id === id);
        if (userIndex === -1) {
            throw new UserNotFoundError(id);
        }
        data.splice(userIndex, 1);
        this.res.writeHead(StatusCode.NoContent, { 'Content-Type': 'application/json' });
        this.res.end();
    }
    async createNewUser(): Promise<void> {
        const newUserData = await getReqData(this.req);
        try {
            newUserPropertiesValidation(newUserData);
            let newUser: UserType = {
                id: v4(),
                ...newUserData
            }
            data = [...data, newUser];
            this.res.writeHead(StatusCode.Created, { 'Content-Type': 'application/json' });
            this.res.end(JSON.stringify(newUser));
        } catch (error) {
            throw error;
        }
    }
    async updateUserByID(id: string): Promise<void> {
        if (!validate(id)) {
            await this.handleBadRequestError(id);
            return;
        }
        const userUpdatedData = await getReqData(this.req);
        let user: UserType | undefined = data.find((u: UserType) => u.id === id);
        if (!user) {
            throw new UserNotFoundError(id);
        }
        const updatedUser = { id, ...userUpdatedData };
        newUserPropertiesValidation(updatedUser);
        data = data.map((u: UserType) => u.id === id ? updatedUser : u);
        await this.handleSuccessRequest(updatedUser);
    }
}

module.exports = Controller;