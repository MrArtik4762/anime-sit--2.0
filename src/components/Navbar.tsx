import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <header className="bg-dark/95 backdrop-blur p-3 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white">
          <span className="text-primary">Ani</span>Stream
        </Link>
        <nav className="hidden md:flex gap-4">
          <NavLink to="/" className={({isActive})=>isActive?'text-primary':'text-gray-300'}>Главная</NavLink>
          <NavLink to="/catalog" className={({isActive})=>isActive?'text-primary':'text-gray-300'}>Каталог</NavLink>
          <NavLink to="/search" className={({isActive})=>isActive?'text-primary':'text-gray-300'}>Поиск</NavLink>
          <NavLink to="/favorites" className={({isActive})=>isActive?'text-primary':'text-gray-300'}>Избранное</NavLink>
        </nav>
        <div className="md:hidden">
          {/* простая кнопка меню для mobile — можно заменить на HeadlessUI Menu */}
          <Link to="/search" className="text-gray-300">🔍</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;