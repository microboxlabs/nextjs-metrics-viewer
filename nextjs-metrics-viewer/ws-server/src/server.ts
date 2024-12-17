import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import http, { IncomingMessage } from 'http';
import url from 'url';

dotenv.config();

const PORT = process.env.WS_PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const BROADCAST_SECRET = process.env.BROADCAST_SECRET || 'mi-clave-secreta-broadcast';

const server = http.createServer();

const wss = new WebSocketServer({ noServer: true });

const authenticateToken = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

server.on('upgrade', (request: IncomingMessage, socket: any, head: Buffer) => {
    const parsedUrl = url.parse(request.url || '', true);
    const { token } = parsedUrl.query;


    if (!token || typeof token !== 'string') {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }

    const user = authenticateToken(token);

    if (!user) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }

    wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
        (ws as any).user = user;
        wss.emit('connection', ws, request);
    });
});

const broadcast = (data: string) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
    const user = (ws as any).user;

    ws.on('message', (message: string) => {
    });

    ws.on('close', () => {
    });
});

server.on('request', (req, res) => {
    if (req.method === 'POST' && req.url === '/broadcast') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { message, secret } = JSON.parse(body);

           
                if (!message) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Message is required' }));
                    return;
                }

                if (secret !== BROADCAST_SECRET) {
                    res.writeHead(403, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Forbidden' }));
                    return;
                }

                broadcast(message);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'Message broadcasted' }));
            } catch (error) {
                console.error('Error procesando solicitud de broadcast:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Servidor WebSocket listen in http://localhost:${PORT}`);
});
