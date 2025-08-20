import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Логотип и описание */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                AnimeSite
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Ваш портал для просмотра аниме онлайн. Большая коллекция аниме в высоком качестве.
              </p>
            </motion.div>
          </div>

          {/* Быстрые ссылки */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              Быстрые ссылки
            </motion.h3>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-2"
            >
              {[
                { path: '/', label: 'Главная' },
                { path: '/catalog', label: 'Каталог' },
                { path: '/favorites', label: 'Избранное' },
                { path: '/settings', label: 'Настройки' }
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                     className="text-gray-500 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-400 transition-all duration-300 ease-in-out"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Социальные сети */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              Социальные сети
            </motion.h3>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-2"
            >
              {[
                { name: 'Twitter', url: '#' },
                { name: 'Discord', url: '#' },
                { name: 'GitHub', url: '#' },
                { name: 'VK', url: '#' }
              ].map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                     className="text-gray-500 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-400 transition-all duration-300 ease-in-out"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center"
        >
          <p className="text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} AnimeSite. Все права защищены.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;