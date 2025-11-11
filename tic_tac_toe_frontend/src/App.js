import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * Board utilities
 */
const WIN_LINES = [
  [0, 1, 2], // rows
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // columns
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // diagonals
  [2, 4, 6],
];

// PUBLIC_INTERFACE
export function calculateWinner(squares) {
  /** Determine winner and winning line for a given 3x3 squares array.
   * Returns: { winner: 'X'|'O'|null, line: number[]|null }
   */
  for (const [a, b, c] of WIN_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

// PUBLIC_INTERFACE
export function isBoardFull(squares) {
  /** Check if all squares are filled. */
  return squares.every((s) => s !== null);
}

/**
 * Square component
 */
// PUBLIC_INTERFACE
function Square({ value, onClick, isWinning, disabled, index }) {
  /** Single grid cell; accessible button with ARIA label. */
  const label = value
    ? `Square ${index + 1}, ${value}`
    : `Square ${index + 1}, empty. Click to place mark`;

  return (
    <button
      className={`ttt-square${isWinning ? ' ttt-square--win' : ''}`}
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
    >
      {value}
    </button>
  );
}

/**
 * Board component
 */
// PUBLIC_INTERFACE
function Board({ squares, winningLine, onSquareClick, isGameOver }) {
  /** 3x3 grid of squares */
  return (
    <div className="ttt-grid" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((val, idx) => {
        const isWinning = winningLine ? winningLine.includes(idx) : false;
        return (
          <Square
            key={idx}
            value={val}
            onClick={() => onSquareClick(idx)}
            isWinning={isWinning}
            disabled={isGameOver || !!val}
            index={idx}
          />
        );
      })}
    </div>
  );
}

/**
 * Game component (main)
 */
// PUBLIC_INTERFACE
function App() {
  /** Main Tic Tac Toe game container with state and UI. */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [theme] = useState('light'); // fixed light per style guide
  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const draw = useMemo(() => !winner && isBoardFull(squares), [winner, squares]);
  const currentPlayer = xIsNext ? 'X' : 'O';
  const gameOver = Boolean(winner) || draw;

  useEffect(() => {
    // ensure app uses light theme colors via data-theme if needed
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  const handleSquareClick = (idx) => {
    if (squares[idx] || gameOver) return;
    const next = squares.slice();
    next[idx] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const restartGame = () => {
    /** Reset the board and state to initial values. */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  let status = `Player ${currentPlayer}'s turn`;
  if (winner) status = `${winner} wins!`;
  else if (draw) status = "It's a draw!";

  return (
    <div className="app-shell">
      <main className="game-container">
        <section className="game-card" aria-labelledby="gameTitle">
          <h1 id="gameTitle" className="game-title">Tic Tac Toe</h1>

          <p
            className={`status ${winner ? 'status--win' : draw ? 'status--draw' : ''}`}
            role="status"
            aria-live="polite"
          >
            {status}
          </p>

          <Board
            squares={squares}
            winningLine={line}
            onSquareClick={handleSquareClick}
            isGameOver={gameOver}
          />

          <div className="controls">
            <button
              className="btn-restart"
              onClick={restartGame}
              aria-label="Restart the game"
            >
              Restart Game
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
