import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../utils/motion';
import GlassCard from '../components/GlassCard';

const NotFound: React.FC = () => {
  const reduceMotion = usePrefersReducedMotion();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <GlassCard className="max-w-2xl w-full text-center p-8 md:p-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Анимированный 404 текст */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <motion.h1 
              className="text-9xl md:text-[12rem] font-bold bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--primary))]/80 to-[hsl(var(--ring))] bg-clip-text text-transparent"
              animate={!reduceMotion ? {
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0],
              } : {}}
              transition={!reduceMotion ? {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              } : {}}
            >
              404
            </motion.h1>
            
            {/* Анимированный аниме персонажей/элементы */}
            <motion.div
              className="absolute -top-4 -right-4 text-6xl"
              animate={!reduceMotion ? {
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              } : {}}
              transition={!reduceMotion ? {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              } : {}}
            >
              🌸
            </motion.div>
            
            <motion.div
              className="absolute -bottom-4 -left-4 text-4xl"
              animate={!reduceMotion ? {
                y: [0, -8, 0],
                rotate: [0, -3, 3, 0],
              } : {}}
              transition={!reduceMotion ? {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              } : {}}
            >
              🎌
            </motion.div>
          </motion.div>
          
          {/* Сообщение об ошибке */}
          <motion.div
            variants={itemVariants}
            className="space-y-4"
          >
            <motion.h2 
              className="text-3xl md:text-5xl font-bold text-gray-300"
              initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={reduceMotion ? {} : { duration: 0.5, delay: 0.2 }}
            >
              Ой! Страница не найдена
            </motion.h2>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-400 max-w-md mx-auto"
              initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={reduceMotion ? {} : { duration: 0.5, delay: 0.4 }}
            >
              Похоже, вы потерялись в мире аниме. Давайте вернемся на главную страницу и найдем что-то интересное!
            </motion.p>
          </motion.div>
          
          {/* Кнопка возврата */}
          <motion.div
            variants={itemVariants}
            className="pt-6"
          >
            <motion.div
              whileHover={!reduceMotion ? { scale: 1.05, y: -2 } : {}}
              whileTap={!reduceMotion ? { scale: 0.95 } : {}}
              initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={reduceMotion ? {} : { duration: 0.5, delay: 0.6 }}
            >
              <Link
                to="/"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))]/80 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-500/50"
              >
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Вернуться на главную
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Дополнительные анимированные элементы */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center space-x-4 pt-8"
          >
            {['🍡', '🍵', '🎎', '🎋'].map((emoji, index) => (
              <motion.div
                key={emoji}
                className="text-3xl"
                animate={!reduceMotion ? {
                  y: [0, -15, 0],
                  rotate: [0, 10, -10, 0],
                } : {}}
                transition={!reduceMotion ? {
                  duration: 2 + index * 0.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                } : {}}
              >
                {emoji}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </GlassCard>
    </div>
  );
};

export default NotFound;