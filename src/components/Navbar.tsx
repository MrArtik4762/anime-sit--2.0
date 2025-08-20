import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from '../utils/motion';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';

const Navbar: React.FC = () => {
  const location = useLocation();
  const reduceMotion = usePrefersReducedMotion();
  const { theme, setTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Варианты анимаций для Navbar с учетом prefers-reduced-motion
  const navbarVariants = {
    hidden: { y: reduceMotion ? 0 : -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Варианты анимаций для ссылок с учетом prefers-reduced-motion
  const linkVariants = {
    hidden: { y: reduceMotion ? 0 : 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Варианты анимации для выпадающего меню
  const dropdownVariants = reduceMotion ? {} : {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: "easeIn"
      }
    }
  };

  // Проверка активной ссылки
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <motion.nav
      variants={reduceMotion ? { visible: { y: 0, opacity: 1 } } : navbarVariants}
      initial={reduceMotion ? undefined : "hidden"}
      animate={reduceMotion ? undefined : "visible"}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeInOut" }}
      className="navbar backdrop-blur bg-white/10 dark:bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Логотип/Название */}
          <motion.div
            variants={reduceMotion ? {} : { visible: { transition: { delay: 0.1 } } }}
            className="flex items-center space-x-2"
          >
            <motion.div
              whileHover={!reduceMotion ? { scale: 1.05 } : {}}
              whileTap={!reduceMotion ? { scale: 0.95 } : {}}
              transition={!reduceMotion ? { duration: 0.2 } : { duration: 0 }}
              className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <motion.span
              className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              initial={reduceMotion ? undefined : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              transition={reduceMotion ? { duration: 0 } : { delay: 0.2, duration: 0.5 }}
            >
              AnimeSite
            </motion.span>
          </motion.div>

          {/* Навигационные ссылки */}
          <motion.div
            variants={reduceMotion ? { visible: { opacity: 1 } } : linkVariants}
            animate={reduceMotion ? undefined : "visible"}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeInOut" }}
            className="hidden md:flex items-center space-x-1"
          >
            {[
              { path: '/', label: 'Главная' },
              { path: '/catalog', label: 'Каталог' },
              { path: '/favorites', label: 'Избранное' },
              { path: '/settings', label: 'Настройки' },
              { path: '/accessibility', label: 'Доступность' },
              { path: '/profile', label: 'Профиль' },
              { path: '/friends', label: 'Друзья' },
              { path: '/activity', label: 'Активность' },
              { path: '/achievements', label: 'Достижения' }
            ].map((item) => (
              <motion.div key={item.path} whileHover={!reduceMotion ? { scale: 1.05 } : {}}>
                <motion.a
                  href={item.path}
                   className={`px-4 py-2 text-sm font-medium ${
                     reduceMotion ? '' : 'transition-all duration-300 ease-in-out'
                   } ${
                     isActive(item.path)
                       ? 'border-b-2 border-purple-500 text-purple-400'
                       : 'text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-white hover:bg-purple-500/10 dark:hover:bg-white/5'
                   }`}
                  whileHover={!reduceMotion ? { scale: 1.05 } : {}}
                  whileTap={!reduceMotion ? { scale: 0.95 } : {}}
                  transition={!reduceMotion ? { duration: 0.2, ease: "easeInOut" } : { duration: 0 }}
                >
                  {item.label}
                </motion.a>
              </motion.div>
            ))}
          </motion.div>

          {/* Поиск, переключатель темы, уведомления и меню пользователя */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={!reduceMotion ? { scale: 1.05 } : {}}
              whileTap={!reduceMotion ? { scale: 0.95 } : {}}
              transition={!reduceMotion ? { duration: 0.2 } : { duration: 0 }}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors transition-all duration-300 ease-in-out"
              aria-label="Поиск"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  // Здесь можно добавить логику открытия поиска
                  console.log('Open search');
                }
              }}
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </motion.button>
            
            <ThemeToggle />
            
            <NotificationBell />
            
            {/* Меню пользователя */}
            <div ref={dropdownRef} className="relative">
              <motion.button
                whileHover={!reduceMotion ? { scale: 1.05 } : {}}
                whileTap={!reduceMotion ? { scale: 0.95 } : {}}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5 transition-colors transition-all duration-300 ease-in-out"
                aria-label="Меню пользователя"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <motion.div
                  whileHover={!reduceMotion ? { rotate: 10 } : {}}
                  transition={{ duration: 0.2 }}
                  className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                >
                  U
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    <div className="py-1">
                      {[
                        { label: 'Профиль', icon: '👤', href: '/profile' },
                        { label: 'Избранное', icon: '⭐', href: '/favorites' },
                        { label: 'Настройки', icon: '⚙️', href: '/settings' },
                        { label: 'Выйти', icon: '🚪', href: '/logout' }
                      ].map((item, index) => (
                        <motion.a
                          key={item.label}
                          href={item.href}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                          whileHover={!reduceMotion ? { scale: 1.02, x: 5 } : {}}
                          whileTap={!reduceMotion ? { scale: 0.98 } : {}}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;