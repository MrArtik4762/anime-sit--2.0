import React from 'react';
import { useFavorites } from '../hooks/useFavorites';
import AnimeCard from '../components/AnimeCard';

const Favorites: React.FC = () => {
  const { items } = useFavorites();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Избранное</h2>
      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">У вас пока нет избранных аниме</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((title) => (
            <AnimeCard key={title.id} title={title} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;