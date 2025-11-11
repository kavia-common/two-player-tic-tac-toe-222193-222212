import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe title', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
});

test('shows initial turn indicator for Player X', () => {
  render(<App />);
  expect(screen.getByText(/Player X's turn/i)).toBeInTheDocument();
});
