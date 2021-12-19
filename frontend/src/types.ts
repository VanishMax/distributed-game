import Peer from 'peerjs';

export interface Player {
  id: string,
  name: string,
  type: 'drawer' | 'guesser',
}

export interface Message {
  name: string,
  message: string,
}

export interface Connection {
  player: Player
  connection: Peer.DataConnection,
}

interface RtcMessageMessage {
  type: 'message',
  message: string,
  player: Player,
  correct: boolean,
}

interface RtcMessageCanvas {
  type: 'canvas',
  // TODO: implement sending canvas events
  drawings: any,
}

export type RtcMessage = RtcMessageMessage | RtcMessageCanvas;
