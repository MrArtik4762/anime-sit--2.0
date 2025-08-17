import React from 'react';
import { useTheme } from '../hooks/useTheme';

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const Option: React.FC<{
    value: 'system' | 'light' | 'dark';
    label: string;
    description: string;
  }> = ({ value, label, description }) => (
    <label className="relative flex items-center p-4 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all duration-200 bg-opacity-50">
      <input
        type="radio"
        name="theme"
        value={value}
        checked={theme === value}
        onChange={() => setTheme(value)}
        className="sr-only"
      />
      <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
        theme === value 
          ? 'border-blue-500 bg-blue-500' 
          : 'border-gray-400 dark:border-gray-600'
      }`}>
        {theme === value && (
          <div className="w-2 h-2 bg-white rounded-full"></div>
        )}
      </div>
      <div className="flex-grow">
        <div className="font-medium text-gray-900 dark:text-gray-100">{label}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{description}</div>
      </div>
    </label>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Заголовок страницы */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Настройки
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Настройте внешний вид приложения под свои предпочтения. Выберите тему оформления, которая вам больше нравится.
        </p>
      </div>

      {/* Секция настроек темы */}
      <div className="glass p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" 
            />
          </svg>
          Тема оформления
        </h2>
        
        <div className="space-y-3">
          <Option
            value="system"
            label="Системная (авто)"
            description="Использовать системные настройки темы устройства"
          />
          <Option
            value="light"
            label="Светлая"
            description="Всегда использовать светлую тему"
          />
          <Option
            value="dark"
            label="Тёмная"
            description="Всегда использовать тёмную тему"
          />
        </div>
      </div>

      {/* Информационная секция */}
      <div className="glass p-6 text-center">
        <div className="flex items-center justify-center mb-3">
          <svg 
            className="w-6 h-6 mr-2 text-blue-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Изменения применятся автоматически
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Выбранная тема будет сохранена и использоваться при следующем посещении сайта
        </p>
      </div>
    </div>
  );
};

export default Settings;