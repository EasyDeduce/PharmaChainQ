import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders PharmaChainQ title', () => {
  render(<App />);
  const titleElement = screen.getByText(/PharmaChainQ - Drug Tracker/i);
  expect(titleElement).toBeInTheDocument();
});

