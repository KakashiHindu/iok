import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('SignBridge AI shell', () => {
  it('renders the dashboard and navigation', () => {
    render(<App />);
    expect(screen.getByText('Bidirectional sign-language communication for everyone')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Live Sign Detection/i })).toBeInTheDocument();
  });
});
