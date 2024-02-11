import { IncomingMessage } from 'http';
import { UncorrectPropertiesError } from '../errors';
import { UserType } from '../data';


export function getReqData(req: IncomingMessage): Promise<UserType> {
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

export function newUserPropertiesValidation(user: Partial<UserType>) {
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
}