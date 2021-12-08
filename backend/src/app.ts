import { createServer } from 'http';
import { Server } from 'socket.io';

const server = createServer();
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    }
});

const DEFAULT_ROOM = 'room';

io.on('connection', (socket) => {
    socket.on('message', (event) => {
        console.log('message', event);
    });

    socket.join(DEFAULT_ROOM);
    socket.to(DEFAULT_ROOM).emit('joined', socket.id);
});

const port: number = 3001;
server.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
});
