import React  from 'preact';
import type { Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import Canvas, { Line } from './components/canvas/Canvas';
import { Message, Player as PlayerType } from './types';
import Player from './components/player/Player';
import './components/chat/chat.css';
import setupRtc from './utils/rtc';
import GameOver from './components/game-over/game-over';

interface GameProps {
  me: PlayerType,
  players: PlayerType[],
  socket: Socket,
  word: string | null,
  leave: () => void,
}

function Game({ me, word, players, socket, leave }: GameProps) {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>(players.map((player) => ({
    name: 'System',
    message: `Player ${player.name} has joined the game!`,
  })));
  const [lines, setLines] = useState<Line[][]>([]);

  const [rtc, setRtc] = useState<ReturnType<typeof setupRtc>>();
  const isDrawer = me.type === 'drawer';
  const [winner, setWinner] = useState<string>();

  const addMessage = (msg: string, name: string) => {
    setMessages((prev) => [...prev, {
      name: name,
      message: msg,
    }]);
  };

  const sendMessage = () => {
    rtc?.sendMessage(text);
    setText('');
  };

  const updateCanvas = (moves: Line[]) => {
    const newLines = [...lines, moves];
    rtc?.updateCanvas(newLines);
    setLines(newLines);
  };

  useEffect(() => {
    const webrtc = setupRtc(me, players, (data) => {
      if (data.type === 'message') {
        addMessage(data.message, data.player.name);
        let isValid = data.correct || (isDrawer && word === data.message);

        if (isDrawer) {
          webrtc.sendMessage(data.message, data.player, isValid);
        }

        if (isValid) {
          setWinner(data.player.name);
          if (isValid) socket?.emit('game-over');
        }
        return;
      }

      if (data.type === 'canvas') {
        setLines(data.drawings);
        return;
      }
    });

    setRtc(webrtc);
  }, []);

  return (
    <>
      <div className="chat">
        <div className="chat_messages">
          {messages.map((message) => (
            <div className="chat_message">
              <span className="chat_message_author">{message.name}: </span>
              {message.message}
            </div>
          ))}
        </div>

        {me.type === 'guesser' ? (
          <div className="chat_input">
            <input
              type="text"
              placeholder="Guess the word"
              value={text}
              onInput={(e) => setText(e.currentTarget.value)}
            />
            <button type="submit" onClick={() => sendMessage()}>Submit</button>
          </div>
        ) : null}
      </div>

      <Canvas
        canDraw={me.type === 'drawer'}
        lines={lines}
        update={updateCanvas}
      />

      <div className="players">
        {players.map((player) => (
          <Player player={player} />
        ))}
      </div>

      <GameOver
        winner={winner}
        amIWinner={winner === me.name}
        goBack={leave}
      />
    </>
  );
}

export default Game;
