import { IncomingMessage } from 'http';


function getReqData(req: IncomingMessage): Promise<object> {
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


module.exports = { getReqData };