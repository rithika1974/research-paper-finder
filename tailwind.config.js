/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#eef9f4',
          100: '#d6f0e5',
          200: '#aee0cc',
          300: '#77c8a8',
          400: '#3faa82',
          500: '#1e8f68',
          600: '#147353',
          700: '#115c43',
          800: '#104937',
          900: '#0e3c2e',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease both',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
