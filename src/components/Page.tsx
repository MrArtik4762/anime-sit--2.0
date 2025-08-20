import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { usePrefersReducedMotion } from '../utils/motion';

interface PageProps {
  children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ children }) => {
  const location = useLocation();
  const reduceMotion = usePrefersReducedMotion();

  // Безопасный ключ для анимации, чтобы избежать проблем при первой загрузке
  const animationKey = location ? location.pathname : 'initial';

  // Оптимизированные варианты анимации для мгновенных переходов
  const pageVariants = reduceMotion ? {} : {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
      filter: "blur(4px)",
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)"
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      filter: "blur(4px)"
    }
  };

  // Варианты для индикатора загрузки
  const loaderVariants = reduceMotion ? {} : {
    initial: {
      opacity: 0,
      scaleX: 0,
    },
    animate: {
      opacity: 1,
      scaleX: 1,
    },
    exit: {
      opacity: 0,
      scaleX: 0,
    }
  };

  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div
        key={animationKey}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen relative"
      >
        {children}
        {/* Индикатор загрузки */}
        {reduceMotion ? (
          <div className="loader-bar fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
        ) : (
          <motion.div
            className="loader-bar fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 shadow-lg z-50"
            variants={loaderVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Page;