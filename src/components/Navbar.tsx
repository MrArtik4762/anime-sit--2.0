import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MagnifyingGlassIcon, Cog6ToothIcon, HomeIcon, FilmIcon, StarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, FilmIcon as FilmIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  return (
    <header className="backdrop-blur-lg bg-white/10 dark:bg-gray-900/10 border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Логотип с градиентной заливкой */}
          <Link
            to="/"
            className="flex items-center space-x-2 transition-transform duration-200 hover:scale-105"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              AniStream
            </span>
          </Link>

          {/* Навигационное меню для десктопа */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) => `
                flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out
                ${isActive
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-500 dark:text-pink-400 shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/30'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive ? <HomeIconSolid className="w-5 h-5" /> : <HomeIcon className="w-5 h-5" />}
                  <span>Главная</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/catalog"
              className={({ isActive }) => `
                flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out
                ${isActive
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-500 dark:text-pink-400 shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/30'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive ? <FilmIconSolid className="w-5 h-5" /> : <FilmIcon className="w-5 h-5" />}
                  <span>Каталог</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/search"
              className={({ isActive }) => `
                flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out
                ${isActive
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-500 dark:text-pink-400 shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/30'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  <span>Поиск</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/favorites"
              className={({ isActive }) => `
                flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out
                ${isActive
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-500 dark:text-pink-400 shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/30'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive ? <StarIconSolid className="w-5 h-5" /> : <StarIcon className="w-5 h-5" />}
                  <span>Избранное</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) => `
                flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out
                ${isActive
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-500 dark:text-pink-400 shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/30'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Cog6ToothIcon className="w-5 h-5" />
                  <span>Настройки</span>
                </>
              )}
            </NavLink>
          </nav>

          {/* Правая часть с кнопками */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {/* Кнопка поиска для мобильных устройств */}
            <Link
              to="/search"
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/30 transition-all duration-200 ease-out"
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </Link>

            {/* Кнопка настроек для мобильных устройств */}
            <Link
              to="/settings"
              className="hidden sm:block p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-800/30 transition-all duration-200 ease-out"
            >
              <Cog6ToothIcon className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;