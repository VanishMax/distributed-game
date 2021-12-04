import React  from 'preact';
import { Player as PlayerType } from '../../types';
import Spinner from '../spinner/Spinner';
import './player.css';

function Player({ player }: { player: PlayerType }) {
  return (
    <div className="player">
      {!player.connected && <Spinner className="player_spinner" />}
      <span className="player_name">{player.nickname}</span>
      <span className="player_score">Score: {player.score || 0}</span>
    </div>
  );
}

export default Player;
