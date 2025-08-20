import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { usePrefersReducedMotion } from '../utils/motion';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const reduceMotion = usePrefersReducedMotion();

  // Улучшенные варианты анимации
  const pageVariants = reduceMotion ? {} : {
    initial: {
      opacity: 0,
      y: 40,
      scale: 0.98,
      filter: "blur(10px)",
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: "easeOut",
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      y: -40,
      scale: 0.98,
      filter: "blur(10px)",
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  };

  // Варианты для swipe bar
  const swipeBarVariants = reduceMotion ? {} : {
    initial: {
      scaleX: 0,
      opacity: 0,
      transformOrigin: "left"
    },
    animate: {
      scaleX: 1,
      opacity: 1,
      transformOrigin: "left",
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    exit: {
      scaleX: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  if (reduceMotion) {
    return (
      <div className="min-h-screen relative">
        {children}
        {/* Swipe bar fallback */}
        <div className="swipe-bar fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--primary))]/80 to-[hsl(var(--ring))] transform scale-x-0 transition-transform duration-300 ease-out"></div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen relative"
      >
        {children}
        {/* Улучшенная анимация swipe bar */}
        <motion.div
          className="swipe-bar fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--primary))]/80 to-[hsl(var(--ring))] shadow-lg"
          variants={swipeBarVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;