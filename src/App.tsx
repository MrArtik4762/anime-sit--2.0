// src/App.tsx
import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Details from './pages/Details';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import AccessibilityTest from './pages/AccessibilityTest';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';
import ActivityPage from './pages/ActivityPage';
import AchievementsPage from './pages/AchievementsPage';
import NotFound from './pages/NotFound';
import PageTransition from './components/PageTransition';
import NotificationProvider from './components/NotificationProvider';
import { useAuth } from './hooks/useAuth';

// Ленивая загрузка компонентов админ-панели
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminUsersPage = React.lazy(() => import('./pages/AdminUsersPage'));
const AdminAnimePage = React.lazy(() => import('./pages/AdminAnimePage'));
const AdminCommentsPage = React.lazy(() => import('./pages/AdminCommentsPage'));
const AdminStats = React.lazy(() => import('./pages/AdminStats'));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/profile" replace />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Доступ запрещен</h2>
          <p className="text-gray-600 mb-6">У вас нет прав администратора для доступа к этой странице</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  
  // Определяем, нужно ли показывать навбар
  const showNavbar = !location.pathname.startsWith('/admin') || !user?.role === 'admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <div className="theme-transition min-h-screen">
        {showNavbar && <Navbar />}
        
        <div className={showNavbar ? "max-w-6xl mx-auto px-4 py-6" : ""}>
          <PageTransition>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/title/:id" element={<Details />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/accessibility" element={<AccessibilityTest />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            
            {/* Админ-панель */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <Suspense fallback={
                      <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      </div>
                    }>
                      <AdminDashboard />
                    </Suspense>
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <Suspense fallback={
                      <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      </div>
                    }>
                      <AdminUsersPage />
                    </Suspense>
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/anime"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <Suspense fallback={
                      <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      </div>
                    }>
                      <AdminAnimePage />
                    </Suspense>
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/comments"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <Suspense fallback={
                      <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      </div>
                    }>
                      <AdminCommentsPage />
                    </Suspense>
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stats"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <Suspense fallback={
                      <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      </div>
                    }>
                      <AdminStats />
                    </Suspense>
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </div>
    </div>
    </NotificationProvider>
  );
};

export default App;