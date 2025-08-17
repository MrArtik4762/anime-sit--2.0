import React from 'react';

interface SkeletonLoaderProps {
  type?: 'text' | 'title' | 'card' | 'avatar' | 'button' | 'list';
  count?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type = 'text', 
  count = 1, 
  className = '' 
}) => {
  const getSkeletonClass = () => {
    switch (type) {
      case 'title':
        return 'skeleton-title';
      case 'card':
        return 'skeleton-card';
      case 'avatar':
        return 'skeleton-avatar';
      case 'button':
        return 'skeleton-button';
      case 'list':
        return 'skeleton-list';
      default:
        return 'skeleton-text';
    }
  };

  const renderSkeletons = () => {
    const skeletons = [];
    for (let i = 0; i < count; i++) {
      skeletons.push(
        <div 
          key={i} 
          className={`skeleton ${getSkeletonClass()} ${className}`}
          style={{ 
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${1.5 + (i * 0.1)}s`
          }}
        />
      );
    }
    return skeletons;
  };

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="skeleton skeleton-title mb-3" />
            <div className="space-y-2">
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text w-3/4" />
              <div className="skeleton skeleton-text w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <div className="space-y-2">{renderSkeletons()}</div>;
};

export default SkeletonLoader;