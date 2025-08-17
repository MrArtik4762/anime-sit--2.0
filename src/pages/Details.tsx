import React from 'react';
import { useParams } from 'react-router-dom';
import { useTitle } from '../services/titles';
import HlsPlayer from '../components/HlsPlayer';

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useTitle(Number(id));

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки</div>;

  const title = data; // зависит от shape

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-4">
        <img src={`https://anilibria.top${title.posters.medium.url}`} alt={title.names.ru} className="w-full rounded" />
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold">{title.names.ru || title.names.en}</h1>
          <p className="mt-2 text-gray-300">{title.description}</p>
        </div>
      </div>

      <section className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Плеер</h3>
        <HlsPlayer sources={title.player?.sources ?? []} />
      </section>
    </div>
  );
};

export default Details;