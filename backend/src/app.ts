import { createServer } from 'http';
import { Server } from 'socket.io';

const server = createServer();
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:3002'],
        methods: ['GET', 'POST'],
    }
});

const DEFAULT_ROOM = 'room';
let connected: { id: string, name: string, type: 'drawer' | 'guesser' | null }[] = [];
let gameStarted = false;

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

const sendInvitation = async () => {
  const sockets = await io.in(DEFAULT_ROOM).fetchSockets();
  const rand = random(0, sockets.length);

  sockets.forEach((sock) => {
      sock.emit('game-started', connected.map((player, i) => ({
          ...player,
          id: player.name,
          type: i === rand ? 'drawer' : 'guesser',
      })));
  });
  gameStarted = true;
};

io.on('connection', async (socket) => {
    if (gameStarted) {
        socket.emit('error', 'Game has already started!');
        return;
    }

    const name = socket.handshake.query?.name as string;
    if (!name || connected.find(sock => sock.name === name)) {
        socket.emit('error', 'The name is already in use!');
        return;
    }

    socket.join(DEFAULT_ROOM);
    connected.push({ id: socket.id, name, type: null });
    console.log(`User ${name} with id ${socket.id} has joined!`);

    socket.emit('joined-amount', connected.length);
    socket.to(DEFAULT_ROOM).emit('joined-amount', connected.length);

    if (connected.length === 4) {
        await sendInvitation();
    }

    socket.on('game-over', async () => {
        gameStarted = false;
        connected = [];
        (await io.fetchSockets()).map(conn => conn.disconnect());
    });

    socket.on('disconnect', () => {
        console.log(`User ${name} with id ${socket.id} has left!`);
        connected = connected.filter((sock) => sock.id !== socket.id);
        if (connected.length <= 1) {
            gameStarted = false;
            io.emit('game-finished');
        }
    });

    socket.on('onload', () => {
        socket.disconnect();
    });
});

const port: number = 3001;
server.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
});
