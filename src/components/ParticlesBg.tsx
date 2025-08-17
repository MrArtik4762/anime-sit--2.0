import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const ParticlesBg: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // Определяем количество частиц в зависимости от размера экрана
  const getParticleCount = () => {
    return dimensions.width < 768 ? 28 : 60;
  };

  // Инициализация частиц
  const initParticles = () => {
    const count = getParticleCount();
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }
    
    setParticles(newParticles);
  };

  // Обработка изменения размера окна
  const handleResize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    initParticles();
  };

  // Анимация частиц
  const animate = () => {
    if (isPaused) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Очистка canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем градиентный фон
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.05)');
    gradient.addColorStop(1, 'rgba(147, 51, 234, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Обновляем и рисуем частицы
    const updatedParticles = particles.map(particle => {
      // Обновляем позицию с wrap-around
      let newX = particle.x + particle.vx;
      let newY = particle.y + particle.vy;
      
      // Wrap-around logic
      if (newX > canvas.width) newX = 0;
      if (newX < 0) newX = canvas.width;
      if (newY > canvas.height) newY = 0;
      if (newY < 0) newY = canvas.height;
      
      return {
        ...particle,
        x: newX,
        y: newY,
      };
    });
    
    setParticles(updatedParticles);
    
    // Рисуем линии между близкими частицами
    for (let i = 0; i < updatedParticles.length; i++) {
      for (let j = i + 1; j < updatedParticles.length; j++) {
        const dx = updatedParticles[i].x - updatedParticles[j].x;
        const dy = updatedParticles[i].y - updatedParticles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          const opacity = 1 - distance / 120;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(updatedParticles[i].x, updatedParticles[i].y);
          ctx.lineTo(updatedParticles[j].x, updatedParticles[j].y);
          ctx.stroke();
        }
      }
    }
    
    // Рисуем частицы
    updatedParticles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();
    });
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Обработка видимости вкладки
  const handleVisibilityChange = () => {
    setIsPaused(document.hidden);
  };

  useEffect(() => {
    // Установка размеров canvas
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = dimensions.width;
        canvasRef.current.height = dimensions.height;
      }
    };

    updateCanvasSize();
    initParticles();

    // Обработчики событий
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Запуск анимации
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions]);

  // Перезапуск анимации при изменении состояния паузы
  useEffect(() => {
    if (!isPaused) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [isPaused]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10"
      style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(147, 51, 234, 0.02) 100%)',
      }}
    />
  );
};

export default ParticlesBg;