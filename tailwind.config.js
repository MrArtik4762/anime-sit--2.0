/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Светлая тема
        'site-bg': '#f8fafc',      // slate-50
        'card-bg': '#ffffff',      // white
        'text-primary': '#111827', // gray-900
        'text-secondary': '#4b5563', // gray-600
        'text-heading': '#1e293b', // slate-800
        'border-color': '#e2e8f0', // gray-200
        'primary': '#3b82f6',      // blue-500
        'primary-hover': '#2563eb', // blue-600
        'secondary': '#f1f5f9',    // slate-100
        'secondary-hover': '#e2e8f0', // slate-200
        'accent': '#8b5cf6',       // violet-500
        'text-hover': '#2563eb',  // Цвет текста при наведении в светлой теме
        'hover-bg': '#f3f4f6',    // Фон при наведении в светлой теме
        
        // Существующие цвета для обратной совместимости
        bgLight: '#ffffff',
        bgDark: '#071029',
        textLight: '#111111',
        textDark: '#e6eef8',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionProperty: {
        'color': 'color, background-color, border-color, text-decoration-color, fill, stroke',
        'bg': 'background-color, background-position, background-image',
        'opacity': 'opacity',
        'shadow': 'box-shadow',
      },
      transitionDuration: {
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
      },
    },
  },
  plugins: [],
};