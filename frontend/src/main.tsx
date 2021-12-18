import React, { render } from 'preact';
import type { Socket } from 'socket.io-client';
import type { Player, Rules, RulesRequest } from './types';
import { useEffect, useState } from 'react';
import Join from './components/join/join';
import './layout.css';
import Game from './game';

function App() {
  const [joined, setJoined] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [rules, setRules] = useState<Rules>();
  const [players, setPlayers] = useState<Player[]>([]);

  const startGame = (rule: RulesRequest) => {
    setJoined(true);
    setRules(rule.rules);
    setPlayers(rule.players.map((player) => ({
      id: player.id,
      nickname: player.name,
      connected: true,
      score: 0,
    })))
  };

  useEffect(() => {
    if (socket) {

    }
  }, [socket]);

  return (
    <div className="layout">
      <div className="header">
        <h1>Distributed game</h1>
        {rules ? (
          <span>
            Congratulations! You are {rules.type}.
            {rules.type === 'guesser'
              ? <span>You need to guess the word.</span>
              : <span>You need to draw the <b>"{rules.word}"</b></span>
            }
          </span>
        ) : null}
      </div>

      {!joined ? (
        <Join
          onJoin={(rules) => startGame(rules)}
          setParentSocket={(sock) => setSocket(sock)}
        />
      ) : rules && players.length && socket ? (
        <Game rules={rules} players={players} socket={socket} />
      ) : null}
    </div>
  );
}

render(<App />, document.getElementById('app')!);
