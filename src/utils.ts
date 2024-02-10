import { IncomingMessage } from 'http';
//import {NewUserType} from './data';
import {UncorrectPropertiesError} from './errors';
import { ServerResponse } from 'http';
import { validate } from 'uuid';
import { Error400, StatusCode, Error404 } from './errors';
import {UserType} from './data';






function getReqData(req: IncomingMessage): Promise<UserType> {
    return new Promise((resolve, reject) => {
        try {
            let body: string = '';
            req.on('data', chunk => {
                body += chunk.toString();
            })

            req.on('end', () => {
                const requestBody = JSON.parse(body);
                resolve(requestBody);
            })
        } catch (error) {
            reject('body parsing error - ' + error);
        }
    })
}

const newUserPropertiesValidation = (user: Partial<UserType>) => {
    let errorMessage: string = '';
    (!user.username || typeof user.username !== 'string')
    && (errorMessage += ' username');

    (!user.age || typeof user.age !== 'number' || user.age < 0)
    && (errorMessage += ' age');

    (!user.hobbies || !Array.isArray(user.hobbies)
    || !user.hobbies.every((hobby) => typeof hobby === 'string'))
    && (errorMessage += ' hobbies');

    if (errorMessage.length > 0) {
        throw new UncorrectPropertiesError(errorMessage);
    }
};


function isJSON(str: any) {
    try {
        JSON.parse(str);
        return true;
    } catch (error) {
        return false;
    }
}



function handleBadRequest(res: ServerResponse, id: string): void {
    if (!validate(id)) {
        res.writeHead(StatusCode.BadRequest, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(new Error400(id).message));
        return;
    }
}



module.exports = { getReqData, newUserPropertiesValidation, handleBadRequest };