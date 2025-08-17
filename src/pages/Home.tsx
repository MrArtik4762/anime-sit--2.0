import React from 'react';
import { useUpdates } from '../services/titles';
import AnimeCard from '../components/AnimeCard';
import { useInView } from 'react-intersection-observer';

const Home: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useUpdates(12);
  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage]);

  const items = data?.pages.flatMap((p: any) => p.data ?? p) ?? [];

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Последние обновления</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((t: any) => (
          <AnimeCard key={t.id} title={t} />
        ))}
      </div>
      <div ref={ref} className="h-8" />
      <div className="mt-4 text-center">
        {isFetchingNextPage ? <span>Загрузка...</span> : hasNextPage ? <span>Прокрутите вниз для загрузки</span> : <span>Больше нет данных</span>}
      </div>
    </section>
  );
};

export default Home;