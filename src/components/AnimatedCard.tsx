import React from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../utils/motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ children, className = '' }) => {
  const reduceMotion = usePrefersReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;