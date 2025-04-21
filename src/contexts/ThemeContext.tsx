import React, { createContext, useContext, useEffect } from 'react';
import { useGlobalStore } from '../store/useGlobalStore';
import { themes, Theme } from '../lib/theme';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDarkMode, toggleDarkMode } = useGlobalStore();

  // Apply theme to document root
  useEffect(() => {
    const theme = themes[isDarkMode ? 'dark' : 'light'];
    document.documentElement.style.setProperty('--background', theme.background);
    document.documentElement.style.setProperty('--component-background', theme.componentBackground);
    document.documentElement.style.setProperty('--text-primary', theme.text.primary);
    document.documentElement.style.setProperty('--text-secondary', theme.text.secondary);
    document.documentElement.style.setProperty('--text-tertiary', theme.text.tertiary);
    document.documentElement.style.setProperty('--border-primary', theme.border.primary);
    document.documentElement.style.setProperty('--border-secondary', theme.border.secondary);
    document.documentElement.style.setProperty('--input-background', theme.input.background);
    document.documentElement.style.setProperty('--input-border', theme.input.border);
    document.documentElement.style.setProperty('--input-text', theme.input.text);
    document.documentElement.style.setProperty('--input-placeholder', theme.input.placeholder);
    
    // Update body class for global styles
    document.body.classList.toggle('dark', isDarkMode);
    document.body.classList.toggle('light', !isDarkMode);
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider 
      value={{
        theme: isDarkMode ? 'dark' : 'light',
        isDarkMode,
        toggleTheme: toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 