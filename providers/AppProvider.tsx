"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeObj } from '@/types';
import { THEMES } from '@/constants/theme';

interface AppContextType {
  theme: string;
  setTheme: (theme: string) => void;
  themeObj: ThemeObj;
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const BOOKMARKS_KEY = 'bharat_first_bookmarks';
const THEME_KEY = 'bharat_first_theme';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState('dark');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load persisted data from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
      const savedBookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]');
      setThemeState(savedTheme);
      setBookmarks(savedBookmarks);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } catch {
      // localStorage not available (SSR or private mode)
    }
  }, []);

  const setTheme = useCallback((newTheme: string) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    try {
      localStorage.setItem(THEME_KEY, newTheme);
    } catch {}
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks(prev => {
      const next = prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id];
      try {
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const isBookmarked = useCallback((id: string) => bookmarks.includes(id), [bookmarks]);

  const themeObj = THEMES[theme] || THEMES.dark;

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return (
      <AppContext.Provider value={{ theme: 'dark', setTheme, themeObj: THEMES.dark, bookmarks: [], toggleBookmark, isBookmarked: () => false }}>
        {children}
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={{ theme, setTheme, themeObj, bookmarks, toggleBookmark, isBookmarked }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
