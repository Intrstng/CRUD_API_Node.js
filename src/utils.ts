import { IncomingMessage } from 'http';
import {NewUserType} from './data';
import {UncorrectPropertiesError} from './errors';


function getReqData(req: IncomingMessage): Promise<NewUserType> {
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

const newUserPropertiesValidation = (user: Partial<NewUserType>) => {
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

module.exports = { getReqData, newUserPropertiesValidation };