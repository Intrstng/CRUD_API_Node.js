import {IncomingMessage, RequestListener, ServerResponse} from 'http';
import {Error404, InternalError, StatusCode, UncorrectPropertiesError} from './errors';
import InMemoryDatabase from './dataBase';
const Controller = require('./Controller');


const db = InMemoryDatabase.getInstance();

export const routes: RequestListener = async (req: IncomingMessage, res: ServerResponse) => {
    try {
        const apiInterface = new Controller(req, res, db);
        const isCurrentUser = req.url && req.url.match(/\/api\/users\/([0-9a-fA-F-]+)/);
        if (isCurrentUser) {
            const id = req.url!.split('/')[3];
            switch (req.method) {
                // GET - /api/users/:id
                case ('GET'):
                    await apiInterface.getUsersByID(id);
                    break;
                // DELETE - /api/users/:id
                case ('DELETE'):
                    await apiInterface.deleteUserByID(id);
                    break;
                // UPDATE - /api/users/:id
                case ('PUT'):
                    await apiInterface.updateUserByID(id);
                    break;
                default:
                    await apiInterface.handleBadRequestError('This API method is not available. Check API method or path in URL.');
            }
        } else if (req.url === '/api/users' || req.url === '/api/users/') {
            switch (req.method) {
                // GET - /api/users
                case ('GET'):
                    await apiInterface.getUsers();
                    break;
                // POST - /api/users/
                case ('POST'):
                    await apiInterface.createNewUser();
                    break;
                default:
                    await apiInterface.handleBadRequestError('This API method is not available. Check API method or path in URL.');
            }
        }
        // No route present
        else {
            await apiInterface.handleUniversalError(StatusCode.NotFound, {message: new Error404(`Route not found: ${req.url}`).message});
        }
    } catch (error) {
        // Send a 500 response
        res.writeHead(StatusCode.InternalServerError, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: new InternalError()!.message}));
    }
}
