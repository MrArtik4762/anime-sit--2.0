import React from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useSearch } from '../services/titles';
import AnimeCard from '../components/AnimeCard';

const SearchPage: React.FC = () => {
  const [q, setQ] = React.useState('');
  const debounced = useDebounce(q, 300);
  const { data, isLoading } = useSearch(debounced);

  const results = (data as any)?.data ?? data ?? [];

  return (
    <div>
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        className="w-full p-3 rounded bg-gray-800 outline-none"
        placeholder="Поиск аниме..."
      />
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {isLoading ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="bg-gray-700 h-48 rounded animate-pulse" />) : results.map((t:any)=> <AnimeCard key={t.id} title={t} />)}
      </div>
    </div>
  );
};

export default SearchPage;