import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  return (
    <header className="app-gradient glass glass-outline p-3 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold" style={{ color: 'var(--text)' }}>
          <span className="text-primary">Ani</span>Stream
        </Link>
        <nav className="hidden md:flex gap-4">
          <NavLink
            to="/"
            className={({isActive})=>isActive?'text-primary'+' font-medium':'text-gray-300'}
            style={{ color: 'var(--text)' }}
          >
            Главная
          </NavLink>
          <NavLink
            to="/catalog"
            className={({isActive})=>isActive?'text-primary'+' font-medium':'text-gray-300'}
            style={{ color: 'var(--text)' }}
          >
            Каталог
          </NavLink>
          <NavLink
            to="/search"
            className={({isActive})=>isActive?'text-primary'+' font-medium':'text-gray-300'}
            style={{ color: 'var(--text)' }}
          >
            Поиск
          </NavLink>
          <NavLink
            to="/favorites"
            className={({isActive})=>isActive?'text-primary'+' font-medium':'text-gray-300'}
            style={{ color: 'var(--text)' }}
          >
            Избранное
          </NavLink>
          <NavLink
            to="/settings"
            className={({isActive})=>isActive?'text-primary'+' font-medium':'text-gray-300'}
            style={{ color: 'var(--text)' }}
          >
            Настройки
          </NavLink>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="md:hidden">
            {/* простая кнопка меню для mobile — можно заменить на HeadlessUI Menu */}
            <Link to="/search" style={{ color: 'var(--text)' }}>🔍</Link>
          </div>
          <div className="hidden sm:block">
            <Link
              to="/settings"
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              style={{ color: 'var(--text)' }}
            >
              ⚙️
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;