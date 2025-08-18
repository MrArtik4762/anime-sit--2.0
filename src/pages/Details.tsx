import React from 'react';
import { useParams } from 'react-router-dom';
import { useTitle } from '../services/titles';
import HlsPlayer from '../components/HlsPlayer';
import CommentsSection from '../components/CommentsSection';

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useTitle(Number(id));

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки</div>;

  const title = data; // зависит от shape

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-6">
        <img src={`https://anilibria.top${title.posters.medium.url}`} alt={title.names.ru} className="w-full rounded-lg shadow-lg" />
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {title.names.ru || title.names.en}
          </h1>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>{title.description}</p>
            {title.genres && (
              <div>
                <h4 className="font-semibold mb-2">Жанры:</h4>
                <div className="flex flex-wrap gap-2">
                  {title.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {title.year && (
              <div>
                <span className="font-semibold">Год:</span> {title.year}
              </div>
            )}
            {title.status && (
              <div>
                <span className="font-semibold">Статус:</span> {title.status}
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Плеер</h3>
        <HlsPlayer sources={title.player?.sources ?? []} />
      </section>

      <section className="mt-12">
        <CommentsSection animeId={id} />
      </section>
    </div>
  );
};

export default Details;