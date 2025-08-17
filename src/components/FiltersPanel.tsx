import React from 'react';
import { useFiltersStore } from '../stores/filters';

const FiltersPanel: React.FC = () => {
  const { genres, toggleGenre, reset } = useFiltersStore();
  
  // Пример жанров - в реальном приложении можно получить из API
  const availableGenres = [
    'Экшен', 'Комедия', 'Драма', 'Фэнтези', 'Романтика',
    'Приключения', 'Ужасы', 'Меха', 'Спорт', 'Мистика'
  ];

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
          Фильтры
        </h3>
        <button
          onClick={reset}
          className="px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 rounded-lg hover:from-pink-500/30 hover:to-purple-500/30 transition-all duration-300 border border-pink-500/30"
        >
          Сбросить
        </button>
      </div>
      
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-lg text-gray-300">Жанры</h4>
        <div className="grid grid-cols-2 gap-2">
          {availableGenres.map(genre => (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                genres.includes(genre)
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-transparent'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-3 text-lg text-gray-300">Сортировка</h4>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 text-gray-300 font-medium">
            По популярности
          </button>
          <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 text-gray-300 font-medium">
            По дате добавления
          </button>
          <button className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 text-gray-300 font-medium">
            По рейтингу
          </button>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="font-medium mb-3 text-lg text-gray-300">Годы</h4>
        <div className="grid grid-cols-3 gap-2">
          {['2024', '2023', '2022', '2021', '2020', '2019'].map(year => (
            <button
              key={year}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 text-sm text-gray-400 border border-transparent"
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;