import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Details from './pages/Details';
import SearchPage from './pages/Search';
import Favorites from './pages/Favorites';
import Navbar from './components/Navbar';
import { Helmet } from 'react-helmet-async';

const App: React.FC = () => {
  console.log('🎯 App.tsx: Компонент App рендерится');
  
  return (
    <>
      <Helmet>
        <title>AniStream — современный клиент Anilibria</title>
        <meta name="description" content="Аниме стриминговый клиент на базе Anilibria API" />
      </Helmet>
      <div className="min-h-screen bg-dark text-white font-sans">
        <Navbar />
        <main className="p-4 max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/title/:id" element={<Details />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>
      </div>
    </>
  );
};

export default App;