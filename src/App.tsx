import React from "react";
import { Routes, Route } from "react-router-dom";
import AppHeader from "./components/layout/AppHeader";
import Footer from "./components/Footer";
import ThemeToggle from "./components/ThemeToggle";
import ParticlesBg from "./components/ParticlesBg";
import Page from "./components/Page";

// Страницы
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Details from "./pages/Details";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import ProfilePage from "./pages/ProfilePage";
import Settings from "./pages/Settings";
import FriendsPage from "./pages/FriendsPage";
import ActivityPage from "./pages/ActivityPage";
import AchievementsPage from "./pages/AchievementsPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Компоненты
import Protected from "./components/Protected";

// Админ страницы
import AdminDashboard from "./pages/AdminDashboard";
import AdminAnimePage from "./pages/AdminAnimePage";
import AdminCommentsPage from "./pages/AdminCommentsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminStats from "./pages/AdminStats";

export default function App() {
  return (
    <>
      <AppHeader /> {/* теперь шапка одна на всё приложение */}
      <ParticlesBg />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <Page>
          <Routes>
            {/* Основные страницы */}
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/anime/:id" element={<Details />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favorites" element={<Favorites />} />
            
            {/* Страницы аутентификации */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Пользовательские страницы (защищенные) */}
            <Route
              path="/profile"
              element={
                <Protected requireAuth={true}>
                  <ProfilePage />
                </Protected>
              }
            />
            <Route
              path="/profile/favorites"
              element={
                <Protected requireAuth={true}>
                  <ProfilePage />
                </Protected>
              }
            />
            <Route
              path="/profile/friends"
              element={
                <Protected requireAuth={true}>
                  <FriendsPage />
                </Protected>
              }
            />
            <Route
              path="/profile/activity"
              element={
                <Protected requireAuth={true}>
                  <ActivityPage />
                </Protected>
              }
            />
            <Route
              path="/settings"
              element={
                <Protected requireAuth={true}>
                  <Settings />
                </Protected>
              }
            />
            <Route
              path="/friends"
              element={
                <Protected requireAuth={true}>
                  <FriendsPage />
                </Protected>
              }
            />
            <Route
              path="/activity"
              element={
                <Protected requireAuth={true}>
                  <ActivityPage />
                </Protected>
              }
            />
            <Route
              path="/achievements"
              element={
                <Protected requireAuth={true}>
                  <AchievementsPage />
                </Protected>
              }
            />
            
            {/* Админ страницы */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/anime" element={<AdminAnimePage />} />
            <Route path="/admin/comments" element={<AdminCommentsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/stats" element={<AdminStats />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Page>
      </main>
      
      <Footer />
      <ThemeToggle />
    </>
  );
}