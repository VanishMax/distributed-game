import React, { render } from 'preact';
import type { Player } from './types';
import { socket } from './utils/sockets';
import { useState } from 'react';
import Join from './components/join/join';
import './layout.css';
import Game from './game';
import getRandomPhrase from './utils/getRandomPhrase';

function App() {
  const [joined, setJoined] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [myPlayer, setMyPlayer] = useState<Player>();
  const [word, setWord] = useState<string | null>();

  const startGame = (gamePlayers: Player[]) => {
    setJoined(true);
    setPlayers(gamePlayers);

    const me = gamePlayers.find(player => player.id === socket?.id) as Player;
    setMyPlayer(me);
    setWord(me.type === 'drawer' ? getRandomPhrase() : null);
  };

  const leaveGame = () => {
    if (socket) {
      socket.emit('unload');
      setMyPlayer(undefined);
      setPlayers([]);
      setWord(undefined);
      setJoined(false);
    }
  };

  return (
    <div className="layout">
      <div className="header">
        <h1>Distributed game</h1>
        {myPlayer ? (
          <span>
            Congratulations! You are {myPlayer.type}.&nbsp;
            {myPlayer.type === 'guesser'
              ? <span>You need to guess the word.</span>
              : <span>You need to draw the <b>"{word}"</b></span>
            }
          </span>
        ) : null}
      </div>

      {!joined ? (
        <Join
          onJoin={(gamePlayers) => startGame(gamePlayers)}
        />
      ) : myPlayer && players.length && socket ? (
        <Game
          me={myPlayer}
          players={players}
          socket={socket}
          word={word as string | null}
          leave={leaveGame}
        />
      ) : null}
    </div>
  );
}

render(<App />, document.getElementById('app')!);
