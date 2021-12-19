import React  from 'preact';
import { Player as PlayerType } from '../../types';
import './player.css';

function Player({ player }: { player: PlayerType }) {
  return (
    <div className="player">
      <span className="player_name">{player.name}</span>
    </div>
  );
}

export default Player;
