export enum StatusCode {
    HTTPError = 0,
    OK = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    NotFound = 404,
    InternalServerError = 500,
}

export class HTTPError extends Error {
    code: StatusCode = StatusCode.HTTPError;
    description: string = '';
    constructor(message: string) {
        super(message);
    }
}

export class Error400 extends HTTPError {
    code: StatusCode = StatusCode.BadRequest;
    description: string = 'The request could not be understood by the server due to incorrect syntax. The client MUST change the request before trying again. DESCRIPTION: ';
    descriptionAdditional_ID: string = 'Invalid user id: ';
    constructor(value: string) {
        super(value);
            this.message = value.length === 66 ? `${this.description}${value}`
                                               : value.length === 32 ? value
                                               : `${this.description}${this.descriptionAdditional_ID}${value}`;
    }
}

export class Error404 extends HTTPError {
    code: StatusCode = StatusCode.NotFound;
    description: string = 'The server can not find the requested resource. DESCRIPTION: ';
    constructor(message: string) {
        super(message);
        this.message = `${this.description}${message}`;
    }
}

// InternalServerError
export class InternalError extends Error {
    code: StatusCode = StatusCode.InternalServerError;
    description: string = 'The server encountered an unexpected condition that prevented it from fulfilling the request. DESCRIPTION:';
    constructor(message: string = 'Internal Server Error. CODE:') {
        super(message);
        this.message = `${this.description} ${this.message} ${this.code}`;
    }
}

export class UserNotFoundError extends Error404 {
    code: StatusCode = StatusCode.NotFound;
    descriptionAdditional: string = `User with this ID not found:`;
    constructor(id: string) {
        super(id);
        this.message = `${this.description}${this.descriptionAdditional} ${id}`;
    }
}

export class UncorrectPropertiesError extends Error {
    code: StatusCode = StatusCode.BadRequest;
    description: string = `Check these object properties for correctness:`;
    constructor(errMsg: string) {
        super(errMsg);
        this.message = `${this.description}${errMsg}`;
    }
}