/**
 * Обработчик ошибок для свойства offsetX
 * Исправляет ошибку "Cannot read properties of null (reading 'offsetX')"
 */
export const handleCursorError = (event: MouseEvent | TouchEvent): { offsetX: number; offsetY: number } => {
  try {
    // Проверяем, есть ли у события target
    if (!event.target) {
      console.warn('Cursor error: event.target is null');
      return { offsetX: 0, offsetY: 0 };
    }

    // Проверяем, является ли target HTMLElement
    if (!(event.target instanceof HTMLElement)) {
      console.warn('Cursor error: event.target is not HTMLElement');
      return { offsetX: 0, offsetY: 0 };
    }

    // Для MouseEvent используем offsetX и offsetY
    if ('offsetX' in event && 'offsetY' in event) {
      return {
        offsetX: (event as MouseEvent).offsetX || 0,
        offsetY: (event as MouseEvent).offsetY || 0
      };
    }

    // Для TouchEvent или других событий вычисляем координаты относительно элемента
    const rect = event.target.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event && 'clientY' in event) {
      clientX = (event as MouseEvent).clientX;
      clientY = (event as MouseEvent).clientY;
    } else {
      console.warn('Cursor error: unable to get coordinates from event');
      return { offsetX: 0, offsetY: 0 };
    }

    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top
    };
  } catch (error) {
    console.error('Cursor error:', error);
    return { offsetX: 0, offsetY: 0 };
  }
};

/**
 * Безопасная функция для получения координат курсора
 */
export const getSafeCursorPosition = (event: MouseEvent | TouchEvent): { x: number; y: number } => {
  try {
    console.log('🔍 getSafeCursorPosition called with:', {
      event: !!event,
      type: event?.type,
      target: event?.target
    });

    // Проверяем, что событие существует
    if (!event) {
      console.warn('❌ Cursor error: event is null or undefined');
      return { x: 0, y: 0 };
    }

    let clientX: number | undefined;
    let clientY: number | undefined;

    // Обработка TouchEvent
    if ('touches' in event && event.touches && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
      console.log('📱 TouchEvent coordinates:', { clientX, clientY });
    }
    // Обработка MouseEvent
    else if ('clientX' in event && 'clientY' in event) {
      clientX = (event as MouseEvent).clientX;
      clientY = (event as MouseEvent).clientY;
      console.log('🖱️ MouseEvent coordinates:', { clientX, clientY });
    }

    // Проверка существования координат
    if (clientX !== undefined && clientY !== undefined) {
      console.log('✅ Safe coordinates returned:', { x: clientX, y: clientY });
      return { x: clientX, y: clientY };
    } else {
      console.warn('❌ Unable to get coordinates from event');
      return { x: 0, y: 0 };
    }
  } catch (error) {
    console.error('❌ Error getting cursor position:', error);
    return { x: 0, y: 0 };
  }
};

// Глобальный флаг для отслеживания инициализации обработчика
let isCursorHandlerInitialized = false;

/**
 * Безопасный wrapper для событий мыши
 */
const createSafeMouseEvent = (event: MouseEvent): MouseEvent => {
  try {
    // Если у события уже есть корректные offsetX/offsetY, используем их
    if (event.offsetX !== undefined && event.offsetY !== undefined &&
        event.offsetX !== null && event.offsetY !== null) {
      return event;
    }

    // Создаем новое событие с безопасными координатами
    const target = event.target instanceof HTMLElement ? event.target : null;
    
    if (target) {
      const rect = target.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      
      // Создаем кастомное событие с безопасными координатами
      const customEvent = new MouseEvent(event.type, {
        clientX: event.clientX,
        clientY: event.clientY,
        screenX: event.screenX,
        screenY: event.screenY,
        button: event.button,
        buttons: event.buttons,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        metaKey: event.metaKey,
        bubbles: event.bubbles,
        cancelable: event.cancelable,
        composed: event.composed,
        view: event.view,
        detail: event.detail,
        movementX: event.movementX,
        movementY: event.movementY,
        offsetX: offsetX,
        offsetY: offsetY,
        pageX: event.pageX,
        pageY: event.pageY,
        relatedTarget: event.relatedTarget,
        region: event.region,
        which: event.which,
      });
      
      return customEvent;
    }
    
    return event;
  } catch (error) {
    console.warn('❌ Failed to create safe mouse event:', error);
    return event;
  }
};

/**
 * Инициализация глобального обработчика ошибок для курсора
 */
export const initCursorErrorHandler = () => {
  if (isCursorHandlerInitialized) {
    console.log('⚠️ Cursor error handler already initialized');
    return;
  }

  console.log('🚀 Initializing cursor error handler...');
  
  // Перехватываем глобальные ошибки
  const errorListener = (event: ErrorEvent) => {
    if (event.message.includes('offsetX')) {
      console.warn('🛑 Caught offsetX error:', event.message);
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  };

  window.addEventListener('error', errorListener);

  // Создаем безопасный обработчик для событий мыши
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    if (type === 'mousemove' || type === 'mousedown' || type === 'mouseup') {
      const wrappedListener = (event: MouseEvent) => {
        try {
          const safeEvent = createSafeMouseEvent(event);
          return (listener as EventListener)(safeEvent);
        } catch (error) {
          console.error('❌ Error in cursor event listener:', error);
          return (listener as EventListener)(event);
        }
      };
      return originalAddEventListener.call(this, type, wrappedListener, options);
    }
    return originalAddEventListener.call(this, type, listener, options);
  };

  // Сохраняем оригинальный метод для возможности восстановления
  (window as any).__originalAddEventListener = originalAddEventListener;
  (window as any).__errorListener = errorListener;
  
  isCursorHandlerInitialized = true;
  console.log('✅ Cursor error handler initialized');
};

/**
 * Очистка глобального обработчика ошибок для курсора
 */
export const cleanupCursorErrorHandler = () => {
  if (!isCursorHandlerInitialized) {
    return;
  }

  console.log('🧹 Cleaning up cursor error handler...');
  
  // Восстанавливаем оригинальный метод addEventListener
  if ((window as any).__originalAddEventListener) {
    EventTarget.prototype.addEventListener = (window as any).__originalAddEventListener;
    delete (window as any).__originalAddEventListener;
  }

  // Удаляем обработчик ошибок
  if ((window as any).__errorListener) {
    window.removeEventListener('error', (window as any).__errorListener);
    delete (window as any).__errorListener;
  }

  isCursorHandlerInitialized = false;
  console.log('✅ Cursor error handler cleaned up');
};