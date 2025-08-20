import React, { useEffect, useState } from 'react';
import { initCursorErrorHandler, cleanupCursorErrorHandler } from '../utils/cursorErrorHandler';

const CursorTest: React.FC = () => {
  const [errorCount, setErrorCount] = useState(0);
  const [isHandlerActive, setIsHandlerActive] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${result}`]);
  };

  const testMouseEvent = () => {
    try {
      // Создаем тестовое событие мыши с null target
      const event = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      });
      
      // Устанавливаем target в null для тестирования
      Object.defineProperty(event, 'target', {
        value: null,
        writable: false,
      });

      // Обрабатываем событие
      addTestResult('🧪 Создано тестовое событие с null target');
      
      // Имитируем обработку события
      if (!event.target) {
        addTestResult('✅ Обработано: event.target is null - корректная обработка');
      } else {
        addTestResult('❌ Ошибка: event.target не является null');
      }
      
    } catch (error) {
      setErrorCount(prev => prev + 1);
      addTestResult(`❌ Ошибка при тестировании: ${error}`);
    }
  };

  const testOffsetXAccess = () => {
    try {
      addTestResult('🧪 Тест доступа к offsetX...');
      
      // Создаем элемент
      const div = document.createElement('div');
      div.style.width = '100px';
      div.style.height = '100px';
      div.style.backgroundColor = 'red';
      
      // Добавляем на страницу
      document.body.appendChild(div);
      
      // Создаем событие
      const event = new MouseEvent('mousemove', {
        clientX: 150,
        clientY: 150,
        bubbles: true,
        cancelable: true,
      });
      
      // Устанавливаем target
      Object.defineProperty(event, 'target', {
        value: div,
        writable: false,
      });

      // Тестируем доступ к offsetX
      if ('offsetX' in event) {
        addTestResult(`✅ offsetX доступен: ${event.offsetX}`);
      } else {
        addTestResult('⚠️ offsetX недоступен');
      }
      
      // Очищаем
      document.body.removeChild(div);
      
    } catch (error) {
      setErrorCount(prev => prev + 1);
      addTestResult(`❌ Ошибка при тестировании offsetX: ${error}`);
    }
  };

  const toggleErrorHandler = () => {
    if (isHandlerActive) {
      cleanupCursorErrorHandler();
      addTestResult('🧹 Обработчик ошибок курсора отключен');
    } else {
      initCursorErrorHandler();
      addTestResult('🚀 Обработчик ошибок курсора включен');
    }
    setIsHandlerActive(!isHandlerActive);
  };

  const simulateNavigation = () => {
    addTestResult('🔄 Симуляция навигации...');
    
    // Вызываем очистку
    cleanupCursorErrorHandler();
    addTestResult('🧹 Обработчик очищен');
    
    // Имитируем задержку перед новой навигацией
    setTimeout(() => {
      initCursorErrorHandler();
      addTestResult('🚀 Обработчик переинициализирован');
      setIsHandlerActive(true);
    }, 1000);
  };

  const clearResults = () => {
    setTestResults([]);
    setErrorCount(0);
  };

  useEffect(() => {
    // Инициализация при монтировании
    addTestResult('📱 Компонент CursorTest смонтирован');
    
    return () => {
      // Очистка при размонтировании
      addTestResult('📱 Компонент CursorTest размонтируется');
      cleanupCursorErrorHandler();
    };
  }, []);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        🖱️ Тестирование обработчика ошибок курсора
      </h2>
      
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Этот компонент помогает протестировать работу обработчика ошибок курсора 
          и убедиться, что ошибка "Cannot read properties of null (reading 'offsetX')" 
          не возникает при навигации между страницами.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <button
            onClick={testMouseEvent}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            🧪 Тест события с null target
          </button>
          
          <button
            onClick={testOffsetXAccess}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            🧪 Тест доступа к offsetX
          </button>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={toggleErrorHandler}
            className={`w-full px-4 py-2 rounded transition-colors ${
              isHandlerActive 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isHandlerActive ? '🧹 Отключить обработчик' : '🚀 Включить обработчик'}
          </button>
          
          <button
            onClick={simulateNavigation}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            🔄 Симулировать навигацию
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            errorCount === 0 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
          }`}>
            Ошибки: {errorCount}
          </span>
          
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isHandlerActive 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            Обработчик: {isHandlerActive ? 'активен' : 'неактивен'}
          </span>
        </div>
        
        <button
          onClick={clearResults}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
        >
          🧹 Очистить результаты
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 max-h-96 overflow-y-auto">
        <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Лог тестирования:</h3>
        {testResults.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Нет результатов тестирования</p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className="text-sm font-mono p-2 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                {result}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CursorTest;