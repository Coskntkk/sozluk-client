import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/layout/components/ThemeToggle';

const TestComponent = () => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-val">{theme}</span>
      <span data-testid="resolved-theme-val">{resolvedTheme}</span>
      <button onClick={() => setTheme('dark')} data-testid="set-dark-btn">Set Dark</button>
      <button onClick={() => setTheme('light')} data-testid="set-light-btn">Set Light</button>
      <button onClick={toggleTheme} data-testid="toggle-btn">Custom Toggle</button>
      <ThemeToggle />
    </div>
  );
};

describe('ThemeContext and ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('provides default theme and initializes correctly', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-val')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved-theme-val')).toHaveTextContent('light');
  });

  it('switches to dark mode and adds dark class to documentElement', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const setDarkBtn = screen.getByTestId('set-dark-btn');
    await user.click(setDarkBtn);

    expect(screen.getByTestId('theme-val')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved-theme-val')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('toggles between dark and light themes smoothly', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByTestId('toggle-btn');

    // Toggle 1: light -> dark
    await user.click(toggleBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');

    // Toggle 2: dark -> light
    await user.click(toggleBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('ThemeToggle button renders and toggles theme when clicked', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeToggleBtn = screen.getByTitle('Switch to Dark mode');
    expect(themeToggleBtn).toBeInTheDocument();

    await user.click(themeToggleBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByTitle('Switch to Light mode')).toBeInTheDocument();
  });
});
