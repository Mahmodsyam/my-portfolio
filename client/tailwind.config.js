/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#040711',
          card: 'rgba(10, 15, 30, 0.75)',
          border: 'rgba(56, 189, 248, 0.25)',
          blue: '#0ea5e9',
          cyan: '#06b6d4',
          neon: '#38bdf8',
          accent: '#818cf8',
          dark: '#070c18'
        },
        studio: {
          bg: '#f8fafc',
          card: 'rgba(255, 255, 255, 0.95)',
          border: 'rgba(226, 232, 240, 0.9)',
          sky: '#0284c7',
          blue: '#2563eb',
          slate: '#0f172a',
          muted: '#64748b'
        }
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Outfit', 'Inter', '"IBM Plex Sans Arabic"', 'Tajawal', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', '"IBM Plex Sans Arabic"', 'Tajawal', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        arabic: ['"IBM Plex Sans Arabic"', 'Tajawal', 'Cairo', 'system-ui', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      }
    },
  },
  plugins: [],
}
