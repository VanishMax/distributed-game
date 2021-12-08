import React  from 'preact';
import './join.css';
import socketConnection from '../../sockets';
import { useState } from 'react';
import setupRtc from '../../rtc';

interface JoinProps {
  onJoin: () => void,
}

function Join({ onJoin }: JoinProps) {
  const [err, setErr] = useState(false);
  const [success, setSuccess] = useState(false);

  const roomJoin = () => {
    socketConnection({
      onConnect: (socket) => {
        console.log('Connected:', socket.id);
        setSuccess(true);
        setupRtc(socket);
        onJoin();
      },
      onError: () => {
        setErr(true)
      },
    })
  };

  return (
    <div className="join">
      <button type="button" className="join_btn" onClick={roomJoin}>Join the room</button>
      {success && <p className="join_joined">Already joined: 1 / 3</p>}
      {err && <p className="join_failed">Failed joining</p>}
    </div>
  );
}

export default Join;
