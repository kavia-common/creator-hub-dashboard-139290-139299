import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard navigation', () => {
  render(<App />);
  const nav = screen.getByText(/Dashboard/i);
  expect(nav).toBeInTheDocument();
});
