import { useState, useEffect } from 'react';
import { Title } from '../types';

export const useFavorites = () => {
  const [items, setItems] = useState<Title[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(items));
  }, [items]);

  const add = (t: Title) => setItems(prev => (prev.find(x => x.id === t.id) ? prev : [...prev, t]));
  const remove = (id: number) => setItems(prev => prev.filter(x => x.id !== id));
  const toggle = (t: Title) => (items.find(x => x.id === t.id) ? remove(t.id) : add(t));

  return { items, add, remove, toggle };
};