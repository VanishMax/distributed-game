import Peer from 'peerjs';
import type { Player } from '../types';

interface Connection {
  player: Player
  connection: Peer.DataConnection,
}

const setupRtc = (id: string, players: Player[]) => {
  const rtc = new Peer(id);
  const connections: Connection[] = [];

  rtc.on('open', (id) => {
    console.log('My peer ID is:', id);

    players.map((player) => {
      const conn = rtc.connect(player.id as string);
      connections.push({
        player,
        connection: conn,
      });
    });
  });

  rtc.on('connection', (conn) => {
    console.log('connected', conn);
    connections.push({
      player: {} as Player,
      connection: conn,
    });
  });
};

export default setupRtc;
