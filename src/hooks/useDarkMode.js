import { useEffect, useState, useCallback } from 'react';

/**
 * Restores dark mode preference on mount and provides a toggle function
 * that synchronizes localStorage and the `data-theme` attribute on <html>.
 */
export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);

  // Restore saved preference on mount (runs only once)
  useEffect(() => {
    const isDark =
      document.documentElement.getAttribute('data-theme') === 'dark';
    setDarkMode(isDark);
  }, []);

  // Explicit toggle handler — persists and syncs attribute on interaction
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.setAttribute(
        'data-theme',
        next ? 'dark' : 'light',
      );
      localStorage.setItem('darkMode', String(next));
      return next;
    });
  }, []);

  return [darkMode, toggleDarkMode];
}
