import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  applyTemporaryTheme: (theme: Theme | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') as Theme;
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    }

    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      return mediaQuery.matches ? 'dark' : 'light';
    }

    return 'light';
  });

  const [tempTheme, setTempTheme] = useState<Theme | null>(null);

  // Apply theme class + persist when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    const applied = tempTheme ?? theme;

    // Remove previous theme class
    root.classList.remove('light', 'dark');

    // Add current theme class (temporary override wins)
    root.classList.add(applied);

    // Store in localStorage
    localStorage.setItem('theme', theme);
  }, [theme, tempTheme]);

  // On mount, if user hasn't manually chosen a theme, load defaults from site settings
  useEffect(() => {
    const manual = typeof window !== 'undefined' ? localStorage.getItem('theme-manual') : null;
    if (manual) return;
    (async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('setting_key, setting_value')
          .in('setting_key', ['default_theme','theme_follow_system']);
        const map = new Map<string, string>();
        (data || []).forEach((row: any) => map.set(row.setting_key, row.setting_value));
        const follow = map.get('theme_follow_system') === 'true';
        const def = (map.get('default_theme') === 'dark') ? 'dark' : 'light';
        if (follow) {
          if (typeof window !== 'undefined' && window.matchMedia) {
            const mq = window.matchMedia('(prefers-color-scheme: dark)');
            setTheme(mq.matches ? 'dark' : 'light');
          } else {
            setTheme(def);
          }
        } else {
          setTheme(def);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    // Listen for system theme changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e: MediaQueryListEvent) => {
        // Only auto-switch if user hasn't manually set a preference
        const stored = localStorage.getItem('theme-manual');
        if (!stored) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    // Mark as manually set
    localStorage.setItem('theme-manual', 'true');
  };

  const toggleTheme = () => {
    handleSetTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, toggleTheme, applyTemporaryTheme: setTempTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
