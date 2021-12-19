import React  from 'preact';
import type { Player } from '../../types';
import { useState } from 'react';
import socketConnection from '../../utils/sockets';
import './join.css';

interface JoinProps {
  onJoin: (players: Player[], name: string) => void,
}

function Join({ onJoin }: JoinProps) {
  const [name, setName] = useState('');
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState(false);
  const [joined, setJoined] = useState(0);

  const roomJoin = () => {
    if (success) return;
    if (!name) {
      setErr('Please, enter the name!');
      return;
    }

    setErr('');
    socketConnection({
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
    })
  };

  return (
    <div className="join">
      <input
        type="text"
        className="join_inp"
        placeholder="Enter the nickname"
        value={name}
        onInput={(e) => setName(e.currentTarget.value)}
      />
      <button disabled={success} type="button" className="join_btn" onClick={roomJoin}>Join the room</button>
      {success && <p className="join_joined">Already joined: {joined} / 4</p>}
      {err && <p className="join_failed">{err}</p>}
    </div>
  );
}

export default Join;
