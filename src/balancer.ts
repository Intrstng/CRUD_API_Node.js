import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import { URL } from 'node:url';
import { routes } from './router';
import 'dotenv/config';

const cpus = availableParallelism() - 1; // '-1' - to reserve one CPU for the main process
const PORT = parseInt(process.env.CLUSTER_PORT || '6000');
let requestStep: number = 0;
const pid = process.pid;

const getRoundRobinPort = (port: number): number => {
    if (requestStep === cpus) {
        requestStep = 1;
    } else {
        requestStep = requestStep + 1;
    }
    return port + requestStep;
};

if (cluster.isPrimary) {
    console.log(`Main process started. Pid: ${pid}`)
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }
// Create a proxy server for load balancing
    const proxyServer = http.createServer((req, res) => {
        const nextPort = getRoundRobinPort(PORT); // using Round-robin algorithm
        console.log(`Request: ${req.method} ${req.url} on port ${PORT}, pid: ${process.pid} >> redirected to port: ${nextPort}`);
        const url = new URL(req.url, `http://${req.headers.host}`);
        const options = {
            ...url,
            headers: req.headers,
            method: req.method,
            port: nextPort,
            path: url.pathname
        };
        req.pipe(
            http.request(options, (response) => {
                console.log(`Response received from port: ${nextPort}`);
                res.writeHead(response.statusCode, response.headers);
                response.pipe(res);
            }),
        );
    });

    proxyServer.listen(PORT, () => {
        console.log(`The load balancer has been successfully created on PORT: ${PORT}`);
    });

    cluster.on('exit', () => {
        console.log('Worker died!');
        cluster.fork(); // reload worker after death
    });
} else if (cluster.isWorker) {
    const workerPort = PORT + cluster.worker.id;
    const workerServer = http.createServer(routes);

    workerServer.listen(workerPort, () => {
        console.log(`Load balancer listening on port: ${workerPort}`);
    });
}