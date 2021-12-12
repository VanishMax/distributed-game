import { createServer } from 'http';
import { Server } from 'socket.io';

const server = createServer();
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:3002'],
        methods: ['GET', 'POST'],
    }
});

io.on('connection', (socket) => {
    console.log('a user connected ' + socket.client.conn.remoteAddress);
});

const port: number = 3001;
server.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
});
