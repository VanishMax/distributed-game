import { io, Socket } from 'socket.io-client';

interface ConnectionProps {
 onConnect: (socket: Socket) => void,
 onDisconnect?: (socket: Socket) => void,
 onError?: () => void,
}

const socketConnection = (props: ConnectionProps) => {
  const socket = io('localhost:3001');

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





