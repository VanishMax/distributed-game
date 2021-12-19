import Peer from 'peerjs';
import type { Player, Connection, RtcMessage } from '../types';

const setupRtc = (me: Player, players: Player[], dataCallback: (d: RtcMessage) => void) => {
  const rtc = new Peer(me.id);
  const connections: Connection[] = [];

  const otherPlayers = players.filter(player => player.id !== me.id);

  rtc.on('open', (id) => {
    console.log('My peer ID is:', id, Date.now());

    if (me.type === 'drawer') {
      otherPlayers.map((player) => {
        const conn = rtc.connect(player.id as string, {
          reliable: true,
        });
        connections.push({
          player,
          connection: conn,
        });
        conn.on('data', (data) => dataCallback(data));
      });
    }
  });

  rtc.on('connection', (conn) => {
    console.log('connected', conn, Date.now());
    connections.push({
      player: {} as Player,
      connection: conn,
    });
    conn.on('data', (data) => dataCallback(data));
  });

  const sendMessage = (text: string, player?: Player, correct?: boolean) => {
    console.log('sending', connections, text);
    connections.map((conn) => {
      conn.connection.send({
        type: 'message',
        player: player || me,
        message: text,
        correct: correct || false,
      });
    });
  };

  return {
    sendMessage,
  };
};

export default setupRtc;
