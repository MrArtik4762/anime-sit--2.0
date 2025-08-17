import React from 'react';
import AnimeCard from '../components/AnimeCard';
import { useUpdates } from '../services/titles';
import FiltersPanel from '../components/FiltersPanel';

const Catalog: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useUpdates(20);

  // TODO: при наличии фильтров — вызывать endpoints с параметрами фильтра
  const items = data?.pages.flatMap((p: any) => p.data ?? p) ?? [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Каталог</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <aside className="md:w-64">
          <FiltersPanel />
        </aside>
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((t: any) => <AnimeCard key={t.id} title={t} />)}
          </div>
          <div className="mt-6 text-center">
            {isFetchingNextPage ? 'Загрузка...' : hasNextPage ? <button onClick={()=>fetchNextPage()} className="btn">Загрузить ещё</button> : 'Конец списка'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;