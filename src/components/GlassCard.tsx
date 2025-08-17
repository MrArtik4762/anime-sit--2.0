import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../utils/motion';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
  className?: string;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, hover = true, glow = true, className = '', ...props }, ref) => {
    const reduceMotion = usePrefersReducedMotion();
    
    const baseClasses = 'rounded-xl overflow-hidden cursor-pointer transform-gpu transition-all duration-300 ease-in-out';
    
    const glassClasses = 'bg-white/70 backdrop-blur-md border border-white/20';
    
    const hoverClasses = hover ? 'hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1' : '';
    
    const glowClasses = glow ? 'dark:hover:shadow-lg dark:hover:shadow-blue-500/25' : '';
    
    const combinedClasses = `${baseClasses} ${glassClasses} ${hoverClasses} ${glowClasses} ${className}`;
    
    if (reduceMotion) {
      return (
        <div ref={ref} className={`${baseClasses} ${glassClasses} ${className}`} {...props}>
          {children}
        </div>
      );
    }
    
    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -4, scale: 1.02 } : undefined}
        whileTap={hover ? { scale: 0.98 } : undefined}
        className={combinedClasses}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;