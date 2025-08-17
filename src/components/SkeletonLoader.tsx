import React from 'react';
import { usePrefersReducedMotion } from '../utils/motion';

interface SkeletonLoaderProps {
  type?: 'text' | 'title' | 'card' | 'avatar' | 'button' | 'list';
  count?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'text',
  className = ''
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const baseClasses = prefersReducedMotion ? 'rounded-lg' : 'animate-pulse rounded-lg';
  
  const variantClasses: Record<string, string> = {
    card: 'aspect-[2/3]',
    text: 'h-4',
    avatar: 'w-12 h-12 rounded-full',
    button: 'h-10 w-32',
    title: 'h-6',
    list: 'h-4',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[type] || variantClasses.text} ${className} bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] ${prefersReducedMotion ? '' : 'animate-shimmer'}`}
      style={{
        backgroundSize: '200% 100%',
        animation: prefersReducedMotion ? 'none' : 'shimmer 2s infinite',
      }}
    />
  );
};

export default SkeletonLoader;