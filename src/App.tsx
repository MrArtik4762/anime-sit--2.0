// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Details from './pages/Details';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import AccessibilityTest from './pages/AccessibilityTest';
import NotFound from './pages/NotFound';
import PageTransition from './components/PageTransition';

const App: React.FC = () => (
  <div className="theme-transition min-h-screen">
    <Navbar />
    <div className="max-w-6xl mx-auto px-4 py-6">
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/title/:id" element={<Details />} />
          <Route path="/search" element={<Search />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/accessibility" element={<AccessibilityTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </div>
  </div>
);

export default App;