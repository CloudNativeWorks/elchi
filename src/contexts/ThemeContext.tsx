import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'elchi-theme-mode';

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getStoredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(getStoredTheme);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const resolvedTheme = useMemo((): ResolvedTheme => {
    return mode === 'system' ? systemTheme : mode;
  }, [mode, systemTheme]);

  const isDark = resolvedTheme === 'dark';

  // Apply theme class and data attribute to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Remove old theme classes
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');

    // Add new theme class
    root.classList.add(resolvedTheme);
    body.classList.add(resolvedTheme);

    // Set data-theme attribute for CSS selectors
    root.setAttribute('data-theme', resolvedTheme);
    body.setAttribute('data-theme', resolvedTheme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#0f172a' : '#ffffff');
    }
  }, [resolvedTheme, isDark]);

  // Persist theme preference
  const setMode = useCallback((newMode: ThemeMode) => {
    localStorage.setItem(STORAGE_KEY, newMode);
    setModeState(newMode);
  }, []);

  // Toggle between light and dark (skipping system)
  const toggleTheme = useCallback(() => {
    const newMode = resolvedTheme === 'dark' ? 'light' : 'dark';
    setMode(newMode);
  }, [resolvedTheme, setMode]);

  const value = useMemo(() => ({
    mode,
    resolvedTheme,
    setMode,
    isDark,
    toggleTheme,
  }), [mode, resolvedTheme, setMode, isDark, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for components that only need to know if dark mode is active
export const useIsDark = (): boolean => {
  const { isDark } = useTheme();
  return isDark;
};

export default ThemeContext;
