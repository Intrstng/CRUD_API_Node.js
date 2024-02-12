import { IncomingMessage, ServerResponse } from 'http';
import {StatusCode} from './errors';

export type UserType = {
    id?: string;
    username: string;
    age: number;
    hobbies: string[];
};

export type UserDataType = UserType[];

export type ErrorMessageType = {
    message: string
}

export interface IController {
    req: IncomingMessage
    res: ServerResponse
    handleBadRequestError(id: string): Promise<void>
    handleNotFoundError(error: Error): Promise<void>
    handleSuccessRequest(code: StatusCode, users: UserType): Promise<void>
    handleUniversalError(code: StatusCode, errMessage: ErrorMessageType): Promise<void>
    getUsers(): Promise<void>
    getUsersByID(id: string): Promise<void>
    deleteUserByID(id: string): Promise<void>
    createNewUser(): Promise<void>
    updateUserByID(id: string): Promise<void>
}