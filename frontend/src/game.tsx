import React  from 'preact';
import type { Socket } from 'socket.io-client';
import { useEffect } from 'react';
import Chat from './components/chat/Chat';
import Canvas from './components/canvas/Canvas';
import { Player as PlayerType, Rules } from './types';
import Player from './components/player/Player';

const players: PlayerType[] = [{
  id: '',
  nickname: 'GneyHabub',
  connected: true,
  score: 0,
}, {
  id: '',
  nickname: 'VanishMax',
  connected: false,
  score: 0,
}];

interface GameProps {
  rules: Rules,
}

function Game({ rules }: GameProps) {
  return (
    <>
      <Chat />
      <Canvas />
      <div className="players">
        {players.map((player) => (
          <Player player={player} />
        ))}
      </div>
    </>
  );
}

export default Game;
