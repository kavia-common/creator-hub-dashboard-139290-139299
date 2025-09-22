import { render, screen } from '@testing-library/react';
import App from './App';

test('renders auth entry point', () => {
  render(<App />);
  // Since routes are now guarded, unauthenticated users should see sign in content
  const signIn = screen.getByText(/Sign in/i);
  expect(signIn).toBeInTheDocument();
});
