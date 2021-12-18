// TODO: https://github.com/jkithome/simple-webrtc-chat-app/blob/master/src/Chat.js
// TODO: https://github.com/jkithome/signalling-server/blob/master/index.js

import type { Socket } from 'socket.io-client';
import Peer from 'peerjs';

interface Connection {
  id: string,
  name: string,
  connection: Peer.DataConnection,
}

const setupRtc = (nickname: string, socket: Socket) => {
  const rtc = new Peer();

  rtc.on('open', (id) => {
    console.log('My peer ID is:', id);

    socket.emit('login', { id, name: nickname });
  });

  let connections: Connection[] = [];

  socket.on('joined', (peer: { id: string, name: string }) => {
    const connection = rtc.connect(peer.id);
    connections.push({
      id: peer.id,
      name: peer.name,
      connection,
    });

    console.log('join', peer.id);
  });
};

export default setupRtc;
