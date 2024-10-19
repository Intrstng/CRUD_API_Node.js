import { IncomingMessage, ServerResponse } from 'http';
import {StatusCode} from './errors';

export type UserType = {
    id?: string;
    username: string;
    age: number;
    hobbies: string[];
};

export interface InMemoryDatabaseInterface {
    getAll(): Promise<UserType[]>;
    getItem(id: string): Promise<UserType | null>;
    deleteItem(id: string): Promise<UserType | null>;
    createItem(item: Omit<UserType, 'id'>): Promise<UserType>;
    updateItem(id: string, item: Partial<Omit<UserType, 'id'>>): Promise<UserType | null>;
}

export type ErrorMessageType = {
    message: string
}

export interface IController {
    req: IncomingMessage
    res: ServerResponse
    handleBadRequestError(id: string): Promise<void>
    handleNotFoundError(error: Error): Promise<void>
    handleSuccessRequest<T>(code: StatusCode, users: T): Promise<void>
    handleUniversalError(code: StatusCode, errMessage: ErrorMessageType): Promise<void>
    getUsers(): Promise<void>
    getUsersByID(id: string): Promise<void>
    deleteUserByID(id: string): Promise<void>
    createNewUser(): Promise<void>
    updateUserByID(id: string): Promise<void>
}