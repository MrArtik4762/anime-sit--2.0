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
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Фильтры</h3>
        <button 
          onClick={reset}
          className="text-sm text-primary hover:text-primary/80"
        >
          Сбросить
        </button>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">Жанры</h4>
        <div className="space-y-2">
          {availableGenres.map(genre => (
            <div key={genre} className="flex items-center">
              <input
                type="checkbox"
                id={`genre-${genre}`}
                checked={genres.includes(genre)}
                onChange={() => toggleGenre(genre)}
                className="mr-2 h-4 w-4 text-primary rounded"
              />
              <label htmlFor={`genre-${genre}`} className="text-sm">
                {genre}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Годы</h4>
        <div className="text-sm text-gray-400">
          Фильтр по годам будет реализован позже
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;