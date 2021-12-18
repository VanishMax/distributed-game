import React  from 'preact';
import type { Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import Canvas from './components/canvas/Canvas';
import { Message, Player as PlayerType, Rules } from './types';
import Player from './components/player/Player';
import './components/chat/chat.css';

interface GameProps {
  rules: Rules,
  players: PlayerType[],
  socket: Socket,
}

function Game({ rules, players, socket }: GameProps) {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>(players.map((player) => ({
    name: 'System',
    message: `Player ${player.nickname} has joined the game!`,
  })));

  const myPlayer = players.find((player) => player.id === socket.id) as PlayerType;

  const sendMessage = () => {
    setMessages([...messages, {
      name: myPlayer.nickname,
      message: text,
    }]);
    setText('');
  };

  useEffect(() => {

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

        <div className="chat_input">
          <input
            type="text"
            placeholder="Guess the word"
            value={text}
            onInput={(e) => setText(e.currentTarget.value)}
          />
          <button type="submit" onClick={() => sendMessage()}>Submit</button>
        </div>
      </div>

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
