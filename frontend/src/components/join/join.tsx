import React  from 'preact';
import type { Player } from '../../types';
import { useState } from 'react';
import socketConnection from '../../utils/sockets';
import './join.css';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

interface JoinProps {
  onJoin: (players: Player[], name: string) => void,
}

function Join({ onJoin }: JoinProps) {
  const [name, setName] = useState('');
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState(false);
  const [joined, setJoined] = useState(0);
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | undefined>(undefined);
  const [waitingReady, setWaitingReady] = useState(false);

  const roomJoin = () => {
    if (success) return;
    if (!name) {
      setErr('Please, enter the name!');
      return;
    }

    setErr('');
    setSocket(socketConnection({
      name,
      onConnect: (s) => {
        setSuccess(true);

        s.on('joined-amount', (amount: number) => {
          setJoined(amount);
        });

        s.on('error', (err: string) => {
          setErr(err);
          setSuccess(false);
        });

        s.on('game-started', (players: Player[]) => {
          onJoin(players, name);
        });

        window.addEventListener('beforeunload', () => {
          s.emit('unload');
        });
      },
      onError: () => {
        setErr('Failed connecting!');
      },
    }));
  };

  const onReady =() => {
    socket?.emit('ready');
    setWaitingReady(true);
  }

  return (
    <div className="join">
      <input
        type="text"
        className="join_inp"
        placeholder="Enter the nickname"
        value={name}
        onInput={(e) => setName(e.currentTarget.value)}
        disabled={success || waitingReady}
      />
      {success && !waitingReady && <button disabled={joined < 4} type="button" className="ready_btn" onClick={onReady}>I'm ready!</button>}
      {!success && !waitingReady && <button disabled={success} type="button" className="join_btn" onClick={roomJoin}>Join the room</button>}
      {success && !waitingReady && <p className="join_joined">4 players at least are required: {joined} / 4</p>}
      {waitingReady && "Waiting for other players to be ready!.."}
      {err && <p className="join_failed">{err}</p>}
    </div>
  );
}

export default Join;
