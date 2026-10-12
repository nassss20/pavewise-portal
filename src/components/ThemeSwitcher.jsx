import React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2.5 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors border border-gray-200 dark:border-zinc-700 shadow-sm flex items-center justify-center"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
