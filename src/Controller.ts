import { validate } from 'uuid';
import { Error400, StatusCode, UserNotFoundError } from './errors';
import { IncomingMessage, ServerResponse } from 'http';
import { InMemoryDatabaseInterface, UserType } from './data';
import { ErrorMessageType } from './data';
import { IController } from './data';
import { getReqData, newUserPropertiesValidation } from './utils/utils';


export class Controller implements IController {
    constructor(public req: IncomingMessage,
                public res: ServerResponse,
                public db: InMemoryDatabaseInterface
    ) {
        this.req = req
        this.res = res
        this.db = db
        // // You can uncomment this code to test the handling of 500 Internal Server Error
        // throw new Error('Test: you simulated error 500 Internal Server Error');
    }

    async handleBadRequestError(id: string): Promise<void> {
        this.res.writeHead(StatusCode.BadRequest, { 'Content-Type': 'application/json' });
        this.res.end(JSON.stringify({ message: new Error400(id).message }));
    }

    async handleNotFoundError(error: Error): Promise<void> {
        this.res.writeHead(StatusCode.NotFound, {'Content-Type': 'application/json'});
        this.res.end(JSON.stringify({message: error.message}));
    }

    async handleSuccessRequest(code: StatusCode, users: UserType): Promise<void> {
        this.res.writeHead(code, { 'Content-Type': 'application/json' });
        this.res.end(JSON.stringify(users));
    }

    async handleUniversalError(code: StatusCode, errMessage: ErrorMessageType): Promise<void> {
        this.res.writeHead(code, {'Content-Type': 'application/json'});
        this.res.end(JSON.stringify(errMessage));
    }

    async getUsers(): Promise<void> {
        new Promise((resolve, _) => resolve(this.db.getAll()))
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
        let user: UserType | null = this.db.getItem(id);
        if (user) {
            await this.handleSuccessRequest(StatusCode.OK, user);
        } else {
            throw new UserNotFoundError(id);
        }
    }

    async deleteUserByID(id: string): Promise<void> {
        if (!validate(id)) {
            await this.handleBadRequestError(id);
            return;
        }
        const deletedUser: UserType | null = this.db.deleteItem(id);
        if (!deletedUser) {
            throw new UserNotFoundError(id);
        }
        this.res.writeHead(StatusCode.NoContent, { 'Content-Type': 'application/json' });
        this.res.end();
    }

    async createNewUser(): Promise<void> {
        const newUserData = await getReqData(this.req, this.res);
        try {
            newUserPropertiesValidation(newUserData);
            let newUser: UserType = this.db.createItem(newUserData);
            await this.handleSuccessRequest(StatusCode.Created, newUser);
        } catch (error) {
            throw error;
        }
    }

    async updateUserByID(id: string): Promise<void> {
        if (!validate(id)) {
            await this.handleBadRequestError(id);
            return;
        }
        const userUpdatedData = await getReqData(this.req, this.res);
        newUserPropertiesValidation(userUpdatedData);
        let updatedUser: UserType | null = this.db.updateItem(id, userUpdatedData);
        if (!updatedUser) {
            throw new UserNotFoundError(id);
        }
        await this.handleSuccessRequest(StatusCode.OK, updatedUser);
    }
}

module.exports = Controller;