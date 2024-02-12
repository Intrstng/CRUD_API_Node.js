import { createServer, Server } from 'http';
import dotenv from 'dotenv';
import {routes} from './router';


dotenv.config();

const PORT = parseInt(process.env.PORT || '5000');
let server: Server;


export function runServer(port: number) {
    server = createServer(routes);
    server.on('error', (error: Error) => {
        console.log(`The server suddenly stopped working: ${(error as Error).message}`);
    });
    server.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
}
runServer(PORT);


export function closeServer() {
    server.close();
}

export function getPort() {
    return PORT;
}