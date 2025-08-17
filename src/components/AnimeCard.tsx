import React from 'react';
import { Title } from '../types';
import { Link } from 'react-router-dom';

const AnimeCard: React.FC<{ title: Title }> = ({ title }) => {
  const poster = title.posters?.medium?.url ? `https://anilibria.top${title.posters.medium.url}` : '/placeholder.jpg';

  return (
    <Link to={`/title/${title.id}`} className="block">
      <div className="bg-gray-800 rounded-xl overflow-hidden transition-transform transform hover:scale-105">
        <div className="w-full h-48 bg-gray-700">
          <img
            src={poster}
            alt={title.names.ru || title.names.en || 'Title'}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="p-3">
          <h3 className="font-bold text-white truncate">{title.names.ru || title.names.en}</h3>
          <p className="text-primary text-sm mt-1">Серии: {title.player?.episodes?.last ?? '—'}</p>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;