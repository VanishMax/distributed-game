import React  from 'preact';
import Confetti  from 'react-confetti';
import './game-over.css';

interface GameOverProps {
  winner: string | undefined,
  amIWinner: boolean;
  goBack: () => void,
}

function GameOver({ winner, amIWinner, goBack }: GameOverProps) {
  return (
    <div className={'game-over' + (winner ? (' open') : '')}>
      {amIWinner ? (
        <>
          <h2>Congratulations!</h2>
          <p>Player <strong>{winner || ''}</strong> won!</p>
          {winner && <Confetti />}
        </>
      ) : (
        <>
          <h2>The game is finished!</h2>
          <p>Player <strong>{winner || ''}</strong> won!</p>
        </>
      )}
      <button type="button" onClick={() => goBack()}>Go back to lobby</button>
    </div>
  );
}

export default GameOver;
