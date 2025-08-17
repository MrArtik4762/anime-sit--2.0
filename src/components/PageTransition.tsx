import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { usePrefersReducedMotion } from '../utils/motion';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const reduceMotion = usePrefersReducedMotion();

  if (reduceMotion) {
    return (
      <div className="min-h-screen relative">
        {children}
        {/* Swipe bar fallback */}
        <div className="swipe-bar fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transform scale-x-0 transition-transform duration-300 ease-out"></div>
      </div>
    );
  }

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-screen relative"
    >
      {children}
      {/* Swipe bar animation */}
      <motion.div
        className="swipe-bar fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        exit={{ scaleX: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </motion.div>
  );
};

export default PageTransition;