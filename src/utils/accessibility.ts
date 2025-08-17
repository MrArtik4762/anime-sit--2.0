/**
 * Утилиты для проверки доступности приложения
 */

/**
 * Проверка поддержки prefers-reduced-motion
 */
export const checkReducedMotionSupport = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Проверка поддержки prefers-contrast
 */
export const checkHighContrastSupport = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

/**
 * Проверка поддержки prefers-color-scheme
 */
export const checkColorSchemeSupport = (): 'light' | 'dark' | 'no-preference' => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'no-preference';
};

/**
 * Проверка доступности клавиатуры
 */
export const testKeyboardNavigation = (): boolean => {
  // Элементы для тестирования
  const interactiveElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  let isAccessible = true;
  
  // Проверяем, что все интерактивные элементы доступны с клавиатуры
  interactiveElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    
    // Проверяем tabindex
    if (htmlElement.tabIndex === -1 && htmlElement.getAttribute('role') !== 'presentation') {
      console.warn(`Элемент ${htmlElement.tagName} имеет tabindex="-1" и может быть недоступен с клавиатуры`);
      isAccessible = false;
    }
    
    // Проверяем aria-label для иконок
    if (htmlElement.tagName === 'SVG' && !htmlElement.getAttribute('aria-label')) {
      console.warn(`SVG элемент не имеет aria-label`);
      isAccessible = false;
    }
  });
  
  return isAccessible;
};

/**
 * Проверка цветовой контрастности
 */
export const testColorContrast = (): boolean => {
  // Получаем основные цвета из CSS переменных
  const style = getComputedStyle(document.documentElement);
  const primaryColor = style.getPropertyValue('--text-primary').trim();
  const backgroundColor = style.getPropertyValue('--bg-primary').trim();
  
  // Простая проверка цветовой контрастности
  // В реальном приложении здесь должна быть более сложная проверка
  const hasGoodContrast = primaryColor !== backgroundColor;
  
  if (!hasGoodContrast) {
    console.warn('Цветовая контрастность может быть недостаточной');
  }
  
  return hasGoodContrast;
};

/**
 * Проверка семантической разметки
 */
export const testSemanticMarkup = (): boolean => {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let isAccessible = true;
  
  // Проверяем наличие заголовков
  if (headings.length === 0) {
    console.warn('На странице нет заголовков (h1-h6)');
    isAccessible = false;
  }
  
  // Проверяем, что есть только один h1
  const h1Elements = document.querySelectorAll('h1');
  if (h1Elements.length > 1) {
    console.warn('На странице несколько элементов h1');
    isAccessible = false;
  }
  
  return isAccessible;
};

/**
 * Полная проверка доступности
 */
export const runAccessibilityTest = (): {
  reducedMotion: boolean;
  highContrast: boolean;
  colorScheme: 'light' | 'dark' | 'no-preference';
  keyboardNavigation: boolean;
  colorContrast: boolean;
  semanticMarkup: boolean;
} => {
  return {
    reducedMotion: checkReducedMotionSupport(),
    highContrast: checkHighContrastSupport(),
    colorScheme: checkColorSchemeSupport(),
    keyboardNavigation: testKeyboardNavigation(),
    colorContrast: testColorContrast(),
    semanticMarkup: testSemanticMarkup(),
  };
};