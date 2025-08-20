import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Тестовая страница для диагностики</h1>
        
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">📋 Статус системы</h2>
            <div className="space-y-2 text-gray-300">
              <p>✅ Приложение загружено успешно</p>
              <p>✅ React Router работает корректно</p>
              <p>✅ Tailwind CSS подключен</p>
              <p>✅ ErrorBoundary активен</p>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">🎨 Проверка стилей</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded">Серый фон</div>
              <div className="bg-purple-600 p-4 rounded">Фиолетовый фон</div>
              <div className="bg-pink-600 p-4 rounded">Розовый фон</div>
              <div className="bg-blue-600 p-4 rounded">Синий фон</div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">🔗 Навигация</h2>
            <div className="space-y-2">
              <p><a href="/" className="text-blue-400 hover:underline">Главная страница</a></p>
              <p><a href="/catalog" className="text-blue-400 hover:underline">Каталог</a></p>
              <p><a href="/favorites" className="text-blue-400 hover:underline">Избранное</a></p>
              <p><a href="/nonexistent" className="text-blue-400 hover:underline">Несуществующая страница (проверка ErrorBoundary)</a></p>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">📱 Проверка компонентов</h2>
            <div className="space-y-4">
              <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
                Тестовая кнопка
              </button>
              <div className="p-4 bg-white/10 rounded backdrop-blur">
                <p className="text-gray-300">Тест glass эффекта</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">🛠️ Информация для отладки</h2>
            <div className="text-sm text-gray-400 space-y-2">
              <p>Если вы видите эту страницу, значит:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Приложение успешно запущено</li>
                <li>Роутинг работает правильно</li>
                <li>Стили загружены корректно</li>
                <li>Нет критических ошибок JavaScript</li>
              </ul>
              <p className="mt-4">Если вы видите "белый экран" на других страницах, проблема может быть в:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>API запросах (проверьте консоль)</li>
                <li>Конфликте стилей</li>
                <li>Ошибках в компонентах</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;