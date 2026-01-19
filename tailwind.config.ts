import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Фирменный оранжевый FoxyVN
        accent: {
          DEFAULT: '#E85D04',
          light: '#FF7A1A',
          dark: '#CC5003',
        },
        dark: {
          primary: '#0D0D0D',
          secondary: '#161616',
          tertiary: '#1A1A1A',
          elevated: '#222222',
          card: '#1A1A1A',
        },
        // Текст
        text: {
          primary: '#FFFFFF',
          secondary: 'rgba(255, 255, 255, 0.85)',
          muted: 'rgba(255, 255, 255, 0.55)',
        },
        // Границы
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          light: 'rgba(255, 255, 255, 0.06)',
          strong: 'rgba(255, 255, 255, 0.15)',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': ['11px', '14px'],
        'sm': ['13px', '18px'],
        'base': ['15px', '22px'],
        'lg': ['17px', '24px'],
        'xl': ['20px', '26px'],
        '2xl': ['24px', '30px'],
        '3xl': ['28px', '34px'],
        '4xl': ['34px', '40px'],
      },
      // Улучшенные размытия для glassmorphism
      backdropBlur: {
        '3xl': '50px',
        '4xl': '60px',
        '5xl': '80px',
      },
      // Радиусы скругления
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        'pill': '9999px',
      },
      // Тени с глубиной
      boxShadow: {
        'sm': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'md': '0 4px 16px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)',
        'lg': '0 12px 40px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.4)',
        'xl': '0 20px 50px rgba(0, 0, 0, 0.6)',
        'accent': '0 8px 24px rgba(232, 93, 4, 0.35)',
        'accent-lg': '0 12px 36px rgba(232, 93, 4, 0.45)',
        'glass': 'inset 0 0 0 0.5px rgba(255, 255, 255, 0.08)',
      },
      // Анимации
      transitionTimingFunction: {
        'out': 'cubic-bezier(0.0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
        '400': '400ms',
      },
      // Масштабирование для hover
      scale: {
        '102': '1.02',
        '103': '1.03',
        '97': '0.97',
        '98': '0.98',
      },
    },
  },
  plugins: [],
}
export default config
