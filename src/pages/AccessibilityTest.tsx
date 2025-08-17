import React, { useState, useEffect } from 'react';
import { 
  runAccessibilityTest, 
  checkReducedMotionSupport, 
  checkHighContrastSupport, 
  checkColorSchemeSupport 
} from '../utils/accessibility';

const AccessibilityTest: React.FC = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    
    // Имитация задержки для тестирования
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const results = runAccessibilityTest();
    setTestResults(results);
    setIsRunning(false);
  };

  useEffect(() => {
    // Запуск тестов при монтировании компонента
    runTests();
  }, []);

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-400' : 'text-red-400';
  };

  const getStatusIcon = (status: boolean) => {
    return status ? '✓' : '✗';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
            Тест доступности
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Проверка поддержки различных предпочтений пользователей и доступности интерфейса
          </p>
        </div>

        {/* Кнопка запуска тестов */}
        <div className="flex justify-center mb-8">
          <button
            onClick={runTests}
            disabled={isRunning}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isRunning ? 'Выполняется тест...' : 'Запустить тесты'}
          </button>
        </div>

        {/* Результаты тестов */}
        {testResults && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-200">Результаты тестирования</h2>
            
            {/* Предпочтения пользователя */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-300">Предпочтения пользователя</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Уменьшенные анимации</span>
                    <span className={`font-bold ${getStatusColor(testResults.reducedMotion)}`}>
                      {getStatusIcon(testResults.reducedMotion)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {testResults.reducedMotion 
                      ? 'Пользователь предпочитает уменьшенные анимации' 
                      : 'Анимации включены'}
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Высокая контрастность</span>
                    <span className={`font-bold ${getStatusColor(testResults.highContrast)}`}>
                      {getStatusIcon(testResults.highContrast)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {testResults.highContrast 
                      ? 'Пользователь предпочитает высокую контрастность' 
                      : 'Контрастность стандартная'}
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Цветовая схема</span>
                    <span className="font-bold text-blue-400">
                      {testResults.colorScheme === 'dark' ? 'Тёмная' : 
                       testResults.colorScheme === 'light' ? 'Светлая' : 'По умолчанию'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Системные настройки цвета
                  </p>
                </div>
              </div>
            </div>

            {/* Проверки доступности */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-300">Проверки доступности</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Навигация с клавиатуры</span>
                    <span className={`font-bold ${getStatusColor(testResults.keyboardNavigation)}`}>
                      {getStatusIcon(testResults.keyboardNavigation)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Все интерактивные элементы доступны с клавиатуры
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Цветовая контрастность</span>
                    <span className={`font-bold ${getStatusColor(testResults.colorContrast)}`}>
                      {getStatusIcon(testResults.colorContrast)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Текст хорошо читается на фоне
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Семантическая разметка</span>
                    <span className={`font-bold ${getStatusColor(testResults.semanticMarkup)}`}>
                      {getStatusIcon(testResults.semanticMarkup)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Правильная структура заголовков
                  </p>
                </div>
              </div>
            </div>

            {/* Рекомендации */}
            <div className="mt-8 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h3 className="text-lg font-semibold mb-2 text-blue-400">Рекомендации</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                {!testResults.reducedMotion && (
                  <li>• Приложение поддерживает prefers-reduced-motion для пользователей с чувствительностью к анимациям</li>
                )}
                {!testResults.highContrast && (
                  <li>• Предусмотрите режим высокой контрастности для пользователей с ограниченным зрением</li>
                )}
                {!testResults.keyboardNavigation && (
                  <li>• Убедитесь, что все элементы доступны с клавиатуры</li>
                )}
                {!testResults.colorContrast && (
                  <li>• Проверьте цветовую контрастность текста и фона</li>
                )}
                {!testResults.semanticMarkup && (
                  <li>• Используйте правильную семантическую разметку для улучшения навигации с экранного считывателя</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Информация о доступности */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Эта страница помогает проверить поддержку различных предпочтений пользователей 
            и доступность интерфейса. Результаты тестирования основаны на текущих настройках 
            вашего браузера и операционной системы.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityTest;