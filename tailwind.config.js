/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Используем CSS переменные из темы
        'surface': 'hsl(var(--surface))',
        'muted': 'hsl(var(--muted))',
        'text': 'hsl(var(--text))',
        'text-muted': 'hsl(var(--text-muted))',
        'text-foreground': 'hsl(var(--text-foreground))',
        'border': 'hsl(var(--border))',
        'primary': 'hsl(var(--primary))',
        'primary-hover': 'hsl(var(--primary-hover))',
        'ring': 'hsl(var(--ring))',
        'ring-hover': 'hsl(var(--ring-hover))',
        
        // Семантические токены для контраста ≥ 4.5
        'bg-primary': 'hsl(var(--surface))',
        'bg-secondary': 'hsl(var(--muted))',
        'bg-card': 'hsl(var(--surface))',
        'bg-popover': 'hsl(var(--surface))',
        
        'text-primary': 'hsl(var(--text))',
        'text-secondary': 'hsl(var(--text-muted))',
        'text-card': 'hsl(var(--text))',
        'text-popover': 'hsl(var(--text))',
        
        'border-primary': 'hsl(var(--border))',
        'border-input': 'hsl(var(--border))',
        'ring-primary': 'hsl(var(--ring))',
        
        'accent-primary': 'hsl(var(--primary))',
        'accent-foreground': 'hsl(var(--text-foreground))',
        
        // Цвета для контраста ≥ 4.5
        'text-high-contrast': {
          light: '#000000',
          dark: '#ffffff',
        },
        
        // Дополнительные цвета для совместимости
        'site-bg': 'hsl(var(--bg))',
        'card-bg': 'hsl(var(--surface))',
        'text-heading': 'hsl(var(--text))',
        'secondary': 'hsl(var(--muted))',
        'secondary-hover': 'hsl(var(--muted-hover))',
        'accent': 'hsl(var(--accent))',
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