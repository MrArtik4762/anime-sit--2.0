import { useState, useEffect } from 'react';

/**
 * Проверяет, предпочитает ли пользователь уменьшенные анимации
 * @returns {boolean} true, если пользователь prefers-reduced-motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
};

/**
 * Возвращает объект с анимациями в зависимости от предпочтений пользователя
 * @param {object} animations Объект с анимациями
 * @returns {object} Объект с анимациями или пустой объект, если prefers-reduced-motion
 */
export const getAnimations = <T extends Record<string, unknown>>(animations: T): T | {} => {
  return prefersReducedMotion() ? {} : animations;
};

/**
 * Возвращает варианты анимаций для framer-motion с учетом prefers-reduced-motion
 * @param {object} variants Объект с вариантами анимаций
 * @returns {object} Варианты анимаций или пустой объект
 */
export const getAnimationVariants = <T extends Record<string, unknown>>(variants: T): T | {} => {
  return prefersReducedMotion() ? { initial: {}, animate: {}, exit: {} } : variants;
};

/**
 * Проверяет, можно ли использовать анимации
 * @returns {boolean} true, если можно использовать анимации
 */
export const canAnimate = (): boolean => {
  return !prefersReducedMotion();
};

/**
 * Хук для проверки prefers-reduced-motion в React компонентах
 * @returns {boolean} true, если пользователь prefers-reduced-motion
 */
export const usePrefersReducedMotion = (): boolean => {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    const checkReducedMotion = () => {
      setReducedMotion(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
    };
    
    // Проверяем сразу
    checkReducedMotion();
    
    // Следим за изменениями
    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mediaQuery) {
      mediaQuery.addEventListener('change', checkReducedMotion);
    }
    
    return () => {
      if (mediaQuery) {
        mediaQuery.removeEventListener('change', checkReducedMotion);
      }
    };
  }, []);
  
  return reducedMotion;
};