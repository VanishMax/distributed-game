import React, { render } from 'preact';
import type { Socket } from 'socket.io-client';
import type { Rules } from './types';
import { useEffect, useState } from 'react';
import Join from './components/join/join';
import './layout.css';
import Game from './game';

function App() {
  const [joined, setJoined] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [rules, setRules] = useState<Rules>();

  const startGame = (rule: Rules) => {
    setJoined(true);
    setRules(rule);
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
              : <span>You need to draw the "{rules.word}"</span>
            }
          </span>
        ) : null}
      </div>
      {!joined ? (
        <Join
          onJoin={(rules) => startGame(rules)}
          setParentSocket={(sock) => setSocket(sock)}
        />
      ) : rules ? (
        <Game rules={rules} />
      ) : null}
    </div>
  );
}

render(<App />, document.getElementById('app')!);
