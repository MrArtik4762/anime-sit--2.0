/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Основные цвета для bg-background и text-foreground
        background: {
          DEFAULT: 'var(--background)',
          light: 'var(--bg-2)',
        },
        foreground: {
          DEFAULT: 'var(--foreground)',
          muted: 'var(--muted-foreground)',
        },
        
        // Семантические токены для контраста ≥ 4.5
        'bg-primary': 'var(--background)',
        'bg-secondary': 'var(--secondary)',
        'bg-card': 'var(--card)',
        'bg-popover': 'var(--popover)',
        
        'text-primary': 'var(--foreground)',
        'text-secondary': 'var(--secondary-foreground)',
        'text-card': 'var(--card-foreground)',
        'text-popover': 'var(--popover-foreground)',
        'text-muted': 'var(--muted-foreground)',
        
        'border-primary': 'var(--border)',
        'border-input': 'var(--input)',
        'ring-primary': 'var(--ring)',
        
        'accent-primary': 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        
        // Основные цвета для совместимости
        'site-bg': 'var(--background)',
        'card-bg': 'var(--card)',
        'text-primary': 'var(--foreground)',
        'text-secondary': 'var(--muted-foreground)',
        'text-heading': 'var(--foreground)',
        'border-color': 'var(--border)',
        'primary': 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        'secondary': 'var(--secondary)',
        'secondary-hover': 'var(--secondary-hover)',
        'accent': 'var(--accent)',
        
        // Цвета для контраста ≥ 4.5
        'text-high-contrast': {
          light: '#000000',
          dark: '#ffffff',
        },
        
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