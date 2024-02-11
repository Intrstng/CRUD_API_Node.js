import { createServer, ServerResponse, IncomingMessage } from 'http';
import { Error404, InternalError, StatusCode } from './errors';
const Controller = require('./Controller');
import dotenv from 'dotenv';


dotenv.config();

const PORT = parseInt(process.env.PORT || '5000');

// Create a local server to receive data from
const server = createServer(async(req: IncomingMessage, res: ServerResponse) => {
    try {
        const apiInterface = new Controller(req, res);

        const isCurrentUser = req.url && req.url.match(/\/api\/users\/([0-9a-fA-F-]+)/);

        if (isCurrentUser) {
            const id = req.url!.split('/')[3];
            switch (req.method) {
                // GET - /api/users/:id
                case ('GET'):
                    try {
                        await apiInterface.getUsersByID(id);
                    } catch (user) {
                        await apiInterface.handleNotFoundError(user);
                    }
                    break;
                // DELETE - /api/users/:id
                case ('DELETE'):
                    try {
                        await apiInterface.deleteUserByID(id);
                    } catch (actionDelete) {
                        await apiInterface.handleNotFoundError(actionDelete);
                    }
                    break;
                // UPDATE - /api/users/:id
                case ('PUT'):
                    try {
                        await apiInterface.updateUserByID(id);
                    } catch (error) {
                        await apiInterface.handleNotFoundError(error);
                    }
                    break;
                default:
                    await apiInterface.handleBadRequestError('This API method is not available. Check API method or path in URL.');
            }
        } else if (req.url === '/api/users') {
            switch (req.method) {
                // GET - /api/users
                case ('GET'):
                    await apiInterface.getUsers();
                    break;
                // POST - /api/users/
                case ('POST'):
                    try {
                        await apiInterface.createNewUser();
                    } catch (error) {
                        res.writeHead(StatusCode.BadRequest, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({message: (error as Error).message}));
                    }
                    break;
                default:
                    await apiInterface.handleBadRequestError('This API method is not available. Check API method or path in URL.');
            }
        }
        // No route present
        else {
            res.writeHead(StatusCode.NotFound, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: new Error404(`Route not found: ${req.url}`).message}));
        }
    } catch (error) {
        // Send a 500 response
        res.writeHead(StatusCode.InternalServerError, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({message: new InternalError()!.message}));
    }
});


server.on('error', (error: Error) => {
    console.log(`The server suddenly stopped working: ${(error as Error).message}`);
});

server.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));