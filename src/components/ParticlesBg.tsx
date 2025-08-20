/**
 * Компонент ParticlesBg - оптимизированный фон с анимированными частицами
 * 
 * Основные оптимизации:
 * - Adaptive particle count (10 на мобильных, 30 на десктопах)
 * - Throttling анимации до 60 FPS
 * - Уменьшенный размер частиц и скорости для лучшей производительности
 * - Intersection Observer для паузы при невидимости элемента
 * - Условный рендеринг только для мобильных устройств
 * - Оптимизированные вычисления distanceSquared для избежания sqrt
 * - Кэширование значений для уменьшения вычислений в рендере
 * - Уменьшенная сила взаимодействия с мышью
 */
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { usePrefersReducedMotion } from '../utils/motion';
import { getSafeCursorPosition } from '../utils/cursorErrorHandler';

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
  const prefersReducedMotion = usePrefersReducedMotion();
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  const mousePosition = useRef({ x: -100, y: -100, radius: 150 });
  const intersectionObserverRef = useRef<IntersectionObserver>();
  const lastFrameTimeRef = useRef<number>(0);
  const frameInterval = 1000 / 60; // 60 FPS
  
  // Оптимизация: ограничиваем devicePixelRatio до 1.5
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  
  // Определяем количество частиц в зависимости от устройства и размера экрана
  const particleCount = useMemo(() => {
    if (prefersReducedMotion) return 0; // Отключаем частицы при prefers-reduced-motion
    const isMobile = dimensions.width < 768;
    return isMobile ? 10 : 30;
  }, [dimensions.width, prefersReducedMotion]);

  // Определяем количество частиц в зависимости от размера экрана
  // TODO: Использовать getParticleCount для динамического расчета

  // Инициализация частиц
  const initParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    const count = particleCount;
    
    // Оптимизация: кэшируем значения для уменьшения вычислений
    const width = dimensions.width;
    const height = dimensions.height;
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.15 + 0.03; // Уменьшена скорость для лучшей производительности
      
      // Оптимизация: вычисляем значения один раз
      const cosAngle = Math.cos(angle);
      const sinAngle = Math.sin(angle);
      const vx = cosAngle * speed;
      const vy = sinAngle * speed;
      
      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx,
        vy,
        originalVx: vx,
        originalVy: vy,
        radius: Math.random() * 0.8 + 0.3, // Уменьшен размер частиц
        opacity: Math.random() * 0.4 + 0.2,
        targetOpacity: Math.random() * 0.4 + 0.2,
      });
    }
    
    particlesRef.current = newParticles;
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
    console.log('🖱️ ParticlesBg handleMouseMove called');
    const { x, y } = getSafeCursorPosition(e);
    console.log('📍 ParticlesBg mouse position updated:', { x, y });
    mousePosition.current = {
      x,
      y,
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

  // Анимация частиц с throttling
  const animate = useCallback((timestamp: number) => {
    if (isPaused) return;
    
    // Throttling: ограничиваем частоту кадров
    if (timestamp - lastFrameTimeRef.current < frameInterval) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }
    
    lastFrameTimeRef.current = timestamp;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Оптимизация: используем более эффективный метод очистки
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(15, 12, 41, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Используем particlesRef для прямого доступа к частицам
    const currentParticles = particlesRef.current;
    const updatedParticles = currentParticles.map(particle => {
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
        newVx = particle.originalVx + Math.cos(angle) * force * 1.2; // Уменьшена сила взаимодействия
        newVy = particle.originalVy + Math.sin(angle) * force * 1.2;
      } else {
        // Возвращаем к исходной скорости с ослаблением
        newVx += (particle.originalVx - particle.vx) * 0.02; // Уменьшена скорость возврата
        newVy += (particle.originalVy - particle.vy) * 0.02;
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
      particle.opacity += opacityDiff * 0.03; // Уменьшена скорость изменения прозрачности
      
      return {
        ...particle,
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy,
        opacity: particle.opacity,
      };
    });
    
    // Обновляем particlesRef
    particlesRef.current = updatedParticles;
    
    // Рисуем линии между близкими частицами с оптимизацией
    ctx.globalCompositeOperation = 'screen';
    const maxDistanceSquared = 100 * 100; // Уменьшено для уменьшения количества линий
    
    for (let i = 0; i < updatedParticles.length; i++) {
      // Оптимизация: уменьшаем количество проверяемых частиц
      const checkRange = Math.min(4, updatedParticles.length - i - 1);
      
      for (let j = i + 1; j <= i + checkRange; j++) {
        const dx = updatedParticles[i].x - updatedParticles[j].x;
        const dy = updatedParticles[i].y - updatedParticles[j].y;
        const distanceSquared = dx * dx + dy * dy;
        
        if (distanceSquared < maxDistanceSquared) {
          const distance = Math.sqrt(distanceSquared);
          const opacity = (1 - distance / 100) * 0.2 * Math.min(updatedParticles[i].opacity, updatedParticles[j].opacity);
          
          ctx.beginPath();
          ctx.strokeStyle = `rgba(77, 171, 247, ${opacity})`;
          ctx.lineWidth = 0.4;
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
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.7})`;
      ctx.fill();
    });
    
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isPaused]);

  // Обработка видимости вкладки
  const handleVisibilityChange = useCallback(() => {
    setIsPaused(document.hidden);
  }, []);

  // IntersectionObserver для паузы при невидимости элемента
  const setupIntersectionObserver = useCallback(() => {
    if (canvasRef.current) {
      intersectionObserverRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) {
              setIsPaused(true);
            } else if (!document.hidden) {
              setIsPaused(false);
            }
          });
        },
        { threshold: 0.1 }
      );
      
      intersectionObserverRef.current.observe(canvasRef.current);
    }
  }, []);

  useEffect(() => {
    // Установка размеров canvas с учетом DPR
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = dimensions.width * dpr;
        canvasRef.current.height = dimensions.height * dpr;
        canvasRef.current.style.width = `${dimensions.width}px`;
        canvasRef.current.style.height = `${dimensions.height}px`;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.scale(dpr, dpr);
        }
      }
    };

    updateCanvasSize();
    initParticles();
    setupIntersectionObserver();

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
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
      }
    };
  }, [dimensions, initParticles, handleResize, handleVisibilityChange, handleMouseMove, handleMouseLeave, animate, setupIntersectionObserver, dpr]);

  // Перезапуск анимации при изменении состояния паузы
  useEffect(() => {
    if (!isPaused) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [isPaused, animate]);

  return prefersReducedMotion ? null : (
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