import React, { useEffect, useState } from 'react';

const Preloader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Симуляция загрузки ресурсов
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Предотвращение преждевременного скрытия при быстрой загрузке
    const checkResources = () => {
      const images = document.images;
      let loaded = 0;
      const total = images.length;

      if (total === 0) {
        setIsLoading(false);
        return;
      }

      const checkAllLoaded = () => {
        if (loaded === total) {
          setIsLoading(false);
        }
      };

      Array.from(images).forEach(img => {
        if (img.complete) {
          loaded++;
        } else {
          img.addEventListener('load', () => {
            loaded++;
            checkAllLoaded();
          });
          img.addEventListener('error', () => {
            loaded++;
            checkAllLoaded();
          });
        }
      });

      checkAllLoaded();
    };

    // Проверяем загруженные ресурсы после начальной задержки
    setTimeout(checkResources, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="preloader">
      <div className="preloader-content">
        <div className="preloader-logo">
          <svg 
            width="80" 
            height="80" 
            viewBox="0 0 80 80" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="transition-all duration-300 hover:scale-110"
          >
            <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="3" className="opacity-20"/>
            <circle cx="40" cy="40" r="25" stroke="currentColor" strokeWidth="3" className="opacity-40"/>
            <circle cx="40" cy="40" r="15" stroke="currentColor" strokeWidth="3" className="opacity-60"/>
            <circle cx="40" cy="40" r="5" fill="currentColor" className="animate-pulse"/>
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2 transition-all duration-500">AniStream</h2>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;