import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

export function useThemeMode() {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && window.localStorage.getItem('theme')) as ThemeMode | null;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next = stored ?? (prefersDark ? 'dark' : 'light');
    setTheme(next);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', next === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', next === 'dark');
      window.localStorage.setItem('theme', next);
    }
  };

  return { theme, isDark: theme === 'dark', toggleTheme };
}
