export const theme = {
  font: {
    family: `'Inter', 'Helvetica Neue', sans-serif`,
    size: {
      heading: 'text-3xl',
      button: 'text-base',
      tokenAmount: 'text-xl',
      label: 'text-sm',
    },
  },
  colors: {
    background: '#0B0C10',
    text: {
      primary: 'text-white',
      secondary: 'text-gray-400',
    },
    gradient: {
      primary: 'from-blue-500 to-purple-800',
      button: 'from-blue-400 to-blue-600',
      alt: 'from-green-400 to-blue-500',
    },
  },
  radius: {
    card: 'rounded-3xl',
    input: 'rounded-xl',
    button: 'rounded-lg',
  },
  shadow: {
    card: 'shadow-[0_0_30px_rgba(0,0,0,0.4)]',
    glow: 'hover:ring-4 hover:brightness-110 hover:shadow-xl',
  },
  layout: {
    cardWidth: 'w-full max-w-[480px]',
    centerScreen: 'flex justify-center items-center min-h-screen',
    padding: 'px-8 py-6',
    spacing: 'space-y-4',
  },
}; 