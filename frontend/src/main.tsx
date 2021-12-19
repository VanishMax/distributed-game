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

  const startGame = (gamePlayers: Player[], name: string) => {
    setJoined(true);
    setPlayers(gamePlayers);

    const me = gamePlayers.find(player => player.id === name) as Player;
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
        <h1 style={{display: "inline", color: "#c20000"}}>A</h1>
        <h1 style={{display: "inline", color: "#c25e00"}}>r</h1>
        <h1 style={{display: "inline", color: "#e4d504"}}>c</h1>
        <h1 style={{display: "inline", color: "#88c200"}}>o</h1>
        <h1 style={{display: "inline", color: "#00c251"}}>b</h1>
        <h1 style={{display: "inline", color: "#00a5c2"}}>a</h1>
        <h1 style={{display: "inline", color: "#004ac2"}}>l</h1>
        <h1 style={{display: "inline", color: "#3a00c2"}}>e</h1>
        <h1 style={{display: "inline", color: "#4a00c2"}}>n</h1>
        <h1 style={{display: "inline", color: "#c200b2"}}>o</h1>
        {myPlayer ? (
          <span style={{display: "block"}}>
            Congratulations! You are a {myPlayer.type}.&nbsp;
            {myPlayer.type === 'guesser'
              ? <span>You need to guess the word.</span>
              : <span>You need to draw a <b>"{word}"</b></span>
            }
          </span>
        ) : null}
      </div>

      {!joined ? (
        <Join
          onJoin={(gamePlayers, myName) => startGame(gamePlayers, myName)}
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
