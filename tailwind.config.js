/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx,jsx,js}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        primary2: '#7C3AED',
        accent: '#6EE7B7',
        bgLight: '#f7f7fb',
        bgDark: '#0f1724',
        glassLight: 'rgba(255,255,255,0.06)',
        glassDark: 'rgba(255,255,255,0.04)',
      },
      borderRadius: {
        xl2: '1rem',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        jp: ['"Noto Sans JP"', 'sans-serif']
      },
      animation: {
        gradientShift: 'gradientShift 12s ease infinite',
        float: 'float 6s ease-in-out infinite',
        fadeInUp: 'fadeInUp 450ms cubic-bezier(.2,.9,.2,1) both',
        glassPulse: 'glassPulse 2.6s ease-in-out infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)'
          },
          '50%': {
            transform: 'translateY(-20px)'
          }
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        glassPulse: {
          '0%, 100%': {
            opacity: '1'
          },
          '50%': {
            opacity: '0.8'
          }
        }
      }
    },
  },
  plugins: [],
}