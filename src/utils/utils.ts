import {IncomingMessage, ServerResponse} from 'http';
import {Error400, StatusCode, UncorrectPropertiesError} from '../errors';
import { UserType } from '../data';


export function getReqData(req: IncomingMessage, res: ServerResponse): Promise<UserType> {
    return new Promise((resolve, reject) => {
        try {
            let body: string = '';
            req.on('data', chunk => {
                body += chunk.toString();
            })

            req.on('end', () => {
                if (body) {
                    const requestBody = JSON.parse(body);
                    resolve(requestBody);
                } else {
                    res.writeHead(StatusCode.BadRequest, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: new Error400('Bad Request: body parsing error.').message }));
                }
            })
        } catch (error) {
            reject('Body parsing error - ' + error);
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


// export function newUserPropertiesValidation(user: Partial<UserType>) {
//     let errorMessage: string = '';
//     if (user) {
//         (!user.username || typeof user.username !== 'string')
//         && (errorMessage += ' username');
//
//         (!user.age || typeof user.age !== 'number' || user.age < 0)
//         && (errorMessage += ' age');
//
//         (!user.hobbies || !Array.isArray(user.hobbies)
//             || !user.hobbies.every((hobby) => typeof hobby === 'string'))
//         && (errorMessage += ' hobbies');
//     } else {
//         errorMessage = 'Request with empty body.';
//     }
//
//
//     if (errorMessage.length > 0) {
//         throw new UncorrectPropertiesError(errorMessage);
//     }
// }