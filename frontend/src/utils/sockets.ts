import { io, Socket } from 'socket.io-client';

interface ConnectionProps {
  name: string,
  onConnect: (socket: Socket) => void,
  onDisconnect?: (socket: Socket) => void,
  onError?: () => void,
}

export let socket: Socket;

const socketConnection = (props: ConnectionProps) => {
  socket = io('localhost:3001', {
    query: { name: props.name },
  });

  socket.on('connect', () => {
    props.onConnect(socket);
  });

  socket.on('disconnect', () => {
    props.onDisconnect?.(socket);
  });

  socket.on('connect_error', () => {
    props.onError?.();
  });
};

export default socketConnection;





