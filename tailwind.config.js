/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container:{center:true,padding:'1rem'},
    spacing:{...require('tailwindcss/defaultTheme').spacing,  '14':'56px'}, 
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'zuni-dark': 'rgba(15, 23, 42, 0.8)',
        'zuni-light': '#94a3b8',
        'zuni-primary': '#4F46E5',
        'zuni-secondary': '#6366F1',
        'zuni-accent': '#3B82F6',
        bluePrimary: '#3B82F6',     // blue-500
        purpleDark: '#6B21A8',      // purple-800
        border: "var(--border-color)",
        input: "var(--input-color)",
        ring: "var(--ring-color)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
