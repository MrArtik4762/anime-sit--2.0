import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  originalVx: number;
  originalVy: number;
  opacity: number;
  targetOpacity: number;
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
  const mousePosition = useRef({ x: -100, y: -100, radius: 150 });
  
  // Оптимизация: кэшируем часто используемые значения
  const particleCount = useMemo(() => {
    return dimensions.width < 768 ? 20 : 30; // Уменьшено для лучшей производительности
  }, [dimensions.width]);

  // Определяем количество частиц в зависимости от размера экрана
  const getParticleCount = useCallback(() => {
    return dimensions.width < 768 ? 25 : 45; // Уменьшено для лучшей производительности
  }, [dimensions.width]);

  // Инициализация частиц
  const initParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.2 + 0.05; // Уменьшена скорость для лучшей производительности
      newParticles.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        originalVx: Math.cos(angle) * speed,
        originalVy: Math.sin(angle) * speed,
        radius: Math.random() * 1 + 0.5, // Уменьшен размер частиц
        opacity: Math.random() * 0.5 + 0.3,
        targetOpacity: Math.random() * 0.5 + 0.3,
      });
    }
    
    setParticles(newParticles);
  }, [particleCount, dimensions.width, dimensions.height]);

  // Обработка изменения размера окна
  const handleResize = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    initParticles();
  }, [initParticles]);

  // Обработка движения мыши
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePosition.current = {
      x: e.clientX,
      y: e.clientY,
      radius: 150,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mousePosition.current = {
      x: -100,
      y: -100,
      radius: 150,
    };
  }, []);

  // Анимация частиц
  const animate = useCallback(() => {
    if (isPaused) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Оптимизация: используем более эффективный метод очистки
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(15, 12, 41, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Обновляем и рисуем частицы
    const updatedParticles = particles.map(particle => {
      // Вычисляем расстояние до мыши с оптимизацией
      const dx = particle.x - mousePosition.current.x;
      const dy = particle.y - mousePosition.current.y;
      const distanceSquared = dx * dx + dy * dy; // Избегаем sqrt для производительности
      
      // Интерактивность с мышью
      let newVx = particle.vx;
      let newVy = particle.vy;
      
      if (distanceSquared < mousePosition.current.radius * mousePosition.current.radius) {
        const distance = Math.sqrt(distanceSquared);
        const force = (mousePosition.current.radius - distance) / mousePosition.current.radius;
        const angle = Math.atan2(dy, dx);
        newVx = particle.originalVx + Math.cos(angle) * force * 1.5; // Уменьшена сила взаимодействия
        newVy = particle.originalVy + Math.sin(angle) * force * 1.5;
      } else {
        // Возвращаем к исходной скорости с ослаблением
        newVx += (particle.originalVx - particle.vx) * 0.03;
        newVy += (particle.originalVy - particle.vy) * 0.03;
      }
      
      // Обновляем позицию
      let newX = particle.x + newVx;
      let newY = particle.y + newVy;
      
      // Wrap-around logic с оптимизацией
      if (newX > canvas.width + 50) newX = -50;
      if (newX < -50) newX = canvas.width + 50;
      if (newY > canvas.height + 50) newY = -50;
      if (newY < -50) newY = canvas.height + 50;
      
      // Плавное изменение прозрачности
      const opacityDiff = particle.targetOpacity - particle.opacity;
      particle.opacity += opacityDiff * 0.05;
      
      return {
        ...particle,
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy,
        opacity: particle.opacity,
      };
    });
    
    setParticles(updatedParticles);
    
    // Рисуем линии между близкими частицами с оптимизацией
    ctx.globalCompositeOperation = 'screen';
    const maxDistanceSquared = 120 * 120;
    
    for (let i = 0; i < updatedParticles.length; i++) {
      // Оптимизация: проверяем только следующие N частиц вместо всех
      const checkRange = Math.min(6, updatedParticles.length - i - 1);
      
      for (let j = i + 1; j <= i + checkRange; j++) {
        const dx = updatedParticles[i].x - updatedParticles[j].x;
        const dy = updatedParticles[i].y - updatedParticles[j].y;
        const distanceSquared = dx * dx + dy * dy;
        
        if (distanceSquared < maxDistanceSquared) {
          const distance = Math.sqrt(distanceSquared);
          const opacity = (1 - distance / 120) * 0.3 * Math.min(updatedParticles[i].opacity, updatedParticles[j].opacity);
          
          ctx.beginPath();
          ctx.strokeStyle = `rgba(77, 171, 247, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(updatedParticles[i].x, updatedParticles[i].y);
          ctx.lineTo(updatedParticles[j].x, updatedParticles[j].y);
          ctx.stroke();
        }
      }
    }
    
    // Рисуем частицы с оптимизацией
    updatedParticles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.8})`;
      ctx.fill();
    });
    
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isPaused, particles]);

  // Обработка видимости вкладки
  const handleVisibilityChange = useCallback(() => {
    setIsPaused(document.hidden);
  }, []);

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
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Запуск анимации
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, initParticles, handleResize, handleVisibilityChange, handleMouseMove, handleMouseLeave, animate]);

  // Перезапуск анимации при изменении состояния паузы
  useEffect(() => {
    if (!isPaused) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [isPaused, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1]"
      style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      }}
    />
  );
};

export default ParticlesBg;