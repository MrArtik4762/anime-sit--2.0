import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';
import Preloader from './components/Preloader';
import ParticlesBg from './components/ParticlesBg';
import PageTransition from './components/PageTransition';
import Navbar from './components/Navbar';

// Ленивая загрузка компонентов для улучшения производительности
const Home = React.lazy(() => import('./pages/Home'));
const Catalog = React.lazy(() => import('./pages/Catalog'));
const Details = React.lazy(() => import('./pages/Details'));
const SearchPage = React.lazy(() => import('./pages/Search'));
const Favorites = React.lazy(() => import('./pages/Favorites'));
const DebugPage = React.lazy(() => import('./pages/Debug'));
const Settings = React.lazy(() => import('./pages/Settings'));

const App: React.FC = () => {
  console.log('🎯 App.tsx: Компонент App рендерится');
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return (
    <ErrorBoundary>
      <div className="app-container">
        {/* Условный рендеринг для мобильных устройств */}
        {isMobile && <ParticlesBg />}
        <Preloader />
        
        <Helmet>
          <title>AniStream — современный клиент Anilibria</title>
          <meta name="description" content="Аниме стриминговый клиент на базе Anilibria API" />
          <meta name="theme-color" content="#121212" />
        </Helmet>
        
        <div className="min-h-screen bg-dark text-white font-sans theme-transition">
          <Navbar />
          
          <main className="container mx-auto px-4 py-6 max-w-6xl">
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="loading-spinner" />
                </div>
              }
            >
              <Routes>
                <Route path="/" element={
                  <PageTransition>
                    <Home />
                  </PageTransition>
                } />
                <Route path="/catalog" element={
                  <PageTransition>
                    <Catalog />
                  </PageTransition>
                } />
                <Route path="/title/:id" element={
                  <PageTransition>
                    <Details />
                  </PageTransition>
                } />
                <Route path="/search" element={
                  <PageTransition>
                    <SearchPage />
                  </PageTransition>
                } />
                <Route path="/favorites" element={
                  <PageTransition>
                    <Favorites />
                  </PageTransition>
                } />
                <Route path="/settings" element={
                  <PageTransition>
                    <Settings />
                  </PageTransition>
                } />
                <Route path="/__debug" element={
                  <PageTransition>
                    <DebugPage />
                  </PageTransition>
                } />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;