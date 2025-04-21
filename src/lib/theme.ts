export const themes = {
  dark: {
    background: '#121212',
    componentBackground: '#1E1E1E',
    primary: '#7e22ce',
    secondary: '#c084fc',
    accent: '#ec4899',
    text: {
      primary: '#FFFFFF',
      secondary: '#94a3b8',
      tertiary: '#64748b',
    },
    border: {
      primary: 'rgba(126, 34, 206, 0.3)',
      secondary: 'rgba(192, 132, 252, 0.2)',
    },
    input: {
      background: 'rgba(30, 30, 30, 0.8)',
      border: 'rgba(126, 34, 206, 0.3)',
      text: '#FFFFFF',
      placeholder: '#64748b',
    },
  },
  light: {
    background: '#FFFFFF',
    componentBackground: '#F5F5F5',
    primary: '#7e22ce',
    secondary: '#c084fc',
    accent: '#ec4899',
    text: {
      primary: '#1E1E1E',
      secondary: '#4B5563',
      tertiary: '#6B7280',
    },
    border: {
      primary: 'rgba(126, 34, 206, 0.2)',
      secondary: 'rgba(192, 132, 252, 0.15)',
    },
    input: {
      background: 'rgba(245, 245, 245, 0.8)',
      border: 'rgba(126, 34, 206, 0.2)',
      text: '#1E1E1E',
      placeholder: '#6B7280',
    },
  },
} as const;

export type Theme = keyof typeof themes;
export type ThemeColors = typeof themes.dark & typeof themes.light; 