import React, { render } from 'preact';
import Chat from './components/chat/Chat';
import './layout.css';
import Canvas from './components/canvas/Canvas';
import { Player as PlayerType } from './types';
import Player from './components/player/Player';
import { useState } from 'react';
import Join from './components/join/join';

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

function App() {
  const [joined, setJoined] = useState(false);

  return (
    <div className="layout">
      <h1>Distributed game</h1>
      {!joined ? (
        <>
          <Join onJoin={() => setJoined(true)} />
        </>
      ) : (
        <>
          <Chat />
          <Canvas />
          <div className="players">
            {players.map((player) => (
              <Player player={player} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

render(<App />, document.getElementById('app')!);
