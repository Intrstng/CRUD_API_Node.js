import { validate } from 'uuid';
import { Error400, InternalError, StatusCode, UncorrectPropertiesError, UserNotFoundError } from './errors';
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

    async handleSuccessRequest<T>(code: StatusCode, data: T): Promise<void> {
        this.res.writeHead(code, { 'Content-Type': 'application/json' });
        this.res.end(JSON.stringify(data));
    }

    async handleSuccessDeleteRequest(): Promise<void> {
        this.res.writeHead(StatusCode.NoContent, { 'Content-Type': 'application/json' });
        this.res.end();
    }

    async handleUniversalError(code: StatusCode, errMessage: ErrorMessageType): Promise<void> {
        this.res.writeHead(code, {'Content-Type': 'application/json'});
        this.res.end(JSON.stringify(errMessage));
    }

    async getUsers(): Promise<void> {
        try {
            const users = await this.db.getAll();
            await this.handleSuccessRequest<UserType[]>(StatusCode.OK, users);
        } catch (error) {
            await this.handleUniversalError(StatusCode.InternalServerError, {message: new InternalError()!.message});
        }
    }

    async getUsersByID(id: string): Promise<void> {
        if (!validate(id)) {
            await this.handleBadRequestError(id);
            return;
        }
        try {
            let user: UserType | null = await this.db.getItem(id);
            if (user) {
                await this.handleSuccessRequest<UserType>(StatusCode.OK, user);
            } else {
                await this.handleNotFoundError(new UserNotFoundError(id));
            }
        } catch (error) {
            await this.handleUniversalError(StatusCode.InternalServerError, {message: new InternalError()!.message});
        }
    }

    async deleteUserByID(id: string): Promise<void> {
        if (!validate(id)) {
            await this.handleBadRequestError(id);
            return;
        }
        try {
            const deletedUser: UserType | null = await this.db.deleteItem(id);
            if (!deletedUser) {
                return await this.handleNotFoundError(new UserNotFoundError(id));
            }
            await this.handleSuccessDeleteRequest();
        } catch (error) {
            await this.handleUniversalError(StatusCode.InternalServerError, {message: new InternalError()!.message});
        }
    }

    async createNewUser(): Promise<void> {
        try {
            const newUserData = await getReqData(this.req, this.res);
            newUserPropertiesValidation(newUserData);
            let newUser: UserType = await this.db.createItem(newUserData);
            await this.handleSuccessRequest<UserType>(StatusCode.Created, newUser);
        } catch (error) {
            await this.handleUniversalError(StatusCode.BadRequest, {message: (error as Error).message});
        }
    }

    async updateUserByID(id: string): Promise<void> {
        if (!validate(id)) {
            await this.handleBadRequestError(id);
            return;
        }
        try {
            const userUpdatedData = await getReqData(this.req, this.res);
            newUserPropertiesValidation(userUpdatedData);
            let updatedUser: UserType | null = await this.db.updateItem(id, userUpdatedData);
            if (!updatedUser) {
                return await this.handleNotFoundError(new UserNotFoundError(id));
            }
            await this.handleSuccessRequest<UserType>(StatusCode.OK, updatedUser);
        } catch (error) {
            if ((error as UncorrectPropertiesError).code === StatusCode.BadRequest) {
                await this.handleUniversalError(StatusCode.BadRequest, {message: (error as Error).message});
            } else {
                await this.handleUniversalError(StatusCode.BadRequest, {message: (error as Error).message});
            }
        }
    }
}

module.exports = Controller;