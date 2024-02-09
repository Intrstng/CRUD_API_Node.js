import { createServer, ServerResponse, IncomingMessage } from 'http';
const Controller = require('./controller');
const { getReqData } = require('./utils');
import { validate } from 'uuid';
import {Error400, StatusCode, Error404} from './errors';
import dotenv from "dotenv";
dotenv.config();

const PORT = parseInt(process.env.PORT || '5000');

interface UserNotFoundError {
    message: string;
}

// Create a local server to receive data from
const server = createServer(async(req: IncomingMessage, res: ServerResponse) => {
    // GET - /api/users
    if (req.url === '/api/users' && req.method  === 'GET') {
        const users = await new Controller().getUsers();
        res.writeHead(StatusCode.OK, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    }
    // GET - /api/users/:id
    else if (req.url && req.method === 'GET' && req.url.match(/\/api\/users\/([0-9a-fA-F-]+)/)) {
        try {
            const id = req.url.split('/')[3];
            if (!validate(id)) {
                res.writeHead(StatusCode.BadRequest, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(new Error400('Invalid user id.').message));
                return;
            }

            const user = await new Controller().getUser(id);
            // if (!user) {
            //     res.writeHead(StatusCode.NotFound, { 'Content-Type': 'application/json' });
            //     res.end(JSON.stringify(new Error404('User with such ID wad not found.').message));
            //     return;
            // }
            res.writeHead(StatusCode.OK, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
        } catch (user) {
            res.writeHead(StatusCode.NotFound, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify((user as Error).message));
        }
    }

    // DELETE - /api/users/:id
    else if (req.url && req.method === 'DELETE' && req.url.match(/\/api\/users\/([0-9a-fA-F-]+)/)) {
        try {
            const id = req.url.split('/')[3];
            if (!validate(id)) {
                res.writeHead(StatusCode.BadRequest, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(new Error400('Invalid user id.').message));
                return;
            }
            const actionDelete = await new Controller().deleteUser(id);
            res.writeHead(StatusCode.NoContent, { 'Content-Type': 'application/json' });
            res.end();
            //res.end(JSON.stringify(actionDelete));
        } catch (actionDelete) {
            res.writeHead(StatusCode.NotFound, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify((actionDelete as Error).message));
        }
    }
    // No route present
    else {
        res.writeHead(StatusCode.NotFound, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(new Error404('Route not found.').message));
    }
});



server.on('error', (error: Error) => {
    console.log(`The server suddenly stopped working: ${(error as Error).message}`);
});


server.on('error', (error: Error) => {
    console.log(`The server suddenly stopped working: ${(error as Error).message}`);
});

server.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));





