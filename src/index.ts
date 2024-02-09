import { createServer, ServerResponse, IncomingMessage } from 'http';
const Controller = require('./controller');
import dotenv from "dotenv";
dotenv.config();

const PORT = parseInt(process.env.PORT || '5000');

// Create a local server to receive data from
const server = createServer(async(req: IncomingMessage, res: ServerResponse) => {
    // GET - /api/users
    if (req.url === '/api/users' && req.method  === 'GET') {
        const todos = await new Controller().getUsers();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(todos));
    }

    // No route present
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({message: 'Route not found'}));
    }
});

server.on('error', (error: Error) => {
    console.log(`The server suddenly stopped working: ${(error as Error).message}`);
});

server.listen(PORT, () => console.log(`Server is on: ${PORT}`));





