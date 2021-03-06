import Peer from 'peerjs';
import type { Player, Connection, RtcMessage } from '../types';
import type { Line } from '../components/canvas/Canvas';

const NAME_HASH = 'kjhk4jhtjknsddjf3';

const setupRtc = (me: Player, players: Player[], dataCallback: (d: RtcMessage) => void) => {
  const rtc = new Peer(NAME_HASH + me.id);
  const connections: Connection[] = [];

  const otherPlayers = players.filter(player => player.id !== me.id);

  rtc.on('open', (id) => {
    console.log('My peer ID is:', id);

    if (me.type === 'drawer') {
      otherPlayers.map((player) => {
        const conn = rtc.connect(NAME_HASH + player.id as string, {
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
    connections.push({
      player: {} as Player,
      connection: conn,
    });
    conn.on('data', (data) => dataCallback(data));
  });

  rtc.on('error', (conn) => {
    console.error(conn);
  });

  const sendMessage = (text: string, player?: Player, correct?: boolean) => {
    connections.map((conn) => {
      conn.connection.send({
        type: 'message',
        player: player || me,
        message: text,
        correct: correct || false,
      } as RtcMessage);
    });
  };

  const updateCanvas = (lines: Line[][]) => {
    connections.map((conn) => {
      conn.connection.send({
        type: 'canvas',
        drawings: lines,
      } as RtcMessage);
    });
  };

  const updateTimer = (timer?: number) => {
    connections.map((conn) => {
      conn.connection.send({
        type: 'timer',
        timer,
      } as RtcMessage);
    });
  };

  const gameLost = (timer?: number) => {
    connections.map((conn) => {
      conn.connection.send({
        type: 'lost',
        timer,
      } as RtcMessage);
    });
  };

  const leave = (player?: Player) => {
    connections.map((conn) => {
      try {
        conn.connection.send({
          type: 'leave',
          player: player || me,
        } as RtcMessage);
      } catch (e) {
        console.error(e);
      }
    });
  };

  const onUnmount = () => {
    rtc.destroy();
  };

  return {
    sendMessage,
    updateCanvas,
    updateTimer,
    onUnmount,
    gameLost,
    leave,
  };
};

export default setupRtc;
