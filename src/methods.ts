import {validate} from 'uuid';
import {Error400, StatusCode} from './errors';
const Controller = require('./controller');
const { getReqData } = require('./utils');
import {IncomingMessage, ServerResponse} from 'http';
import {UserType} from './data';

class MethodsAPI {
    constructor(public req: IncomingMessage, public res: ServerResponse) {
        this.req = req
        this.res = res
    }

    async sendBadRequestMessage(id: string) {
        this.res.writeHead(StatusCode.BadRequest, { 'Content-Type': 'application/json' });
        this.res.end(JSON.stringify({ message: new Error400(id).message }));
    }

    async getUsers(): Promise<void> {
        const users = await new Controller().getUsers();
        this.res.writeHead(StatusCode.OK, { 'Content-Type': 'application/json' });
        this.res.end(JSON.stringify(users));
        // ................
    }

    async getUsersByID(id: string): Promise<void> {
        if (!validate(id)) {
            await this.sendBadRequestMessage(id);
            return;
        }

        const user = await new Controller().getUser(id);
        this.res.writeHead(StatusCode.OK, { 'Content-Type': 'application/json' });
        this.res.end(JSON.stringify(user));
    }
    async deleteUserByID(id: string): Promise<void> {
        if (!validate(id)) {
            await this.sendBadRequestMessage(id);
            return;
        }
        const actionDelete = await new Controller().deleteUser(id);
        this.res.writeHead(StatusCode.NoContent, { 'Content-Type': 'application/json' });
        this.res.end();
        //res.end(JSON.stringify(actionDelete));
    }
    async postNewUser(): Promise<void> {
        const newUserData = await getReqData(this.req);
        let newUser = await new Controller().createUser(newUserData);
        this.res.writeHead(StatusCode.Created, { 'Content-Type': 'application/json' });
        this.res.end(JSON.stringify(newUser));
    }
    async updateUserByID(id: string): Promise<void> {
        if (!validate(id)) {
            await this.sendBadRequestMessage(id);
            return;
        }
        const userUpdatedData = await getReqData(this.req);
        const updatedUser = await new Controller().updateUser(id, userUpdatedData);
        this.res.writeHead(StatusCode.OK, { 'Content-Type': 'application/json' });
        this.res.end(JSON.stringify(updatedUser));
    }
}

module.exports = MethodsAPI;