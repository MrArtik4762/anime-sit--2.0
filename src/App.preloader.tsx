import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ThemeToggle from "./components/ThemeToggle";
import NotificationProvider from "./components/NotificationProvider";
import Preloader from "./components/Preloader";
// import ParticlesBg from "./components/ParticlesBg";

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
import NotFound from "./pages/NotFound";

// Админ страницы
import AdminDashboard from "./pages/AdminDashboard";
import AdminAnimePage from "./pages/AdminAnimePage";
import AdminCommentsPage from "./pages/AdminCommentsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminStats from "./pages/AdminStats";

function App() {
  return (
    <div className="app min-h-screen flex flex-col bg-background text-foreground">
      <Preloader />
      {/* <ParticlesBg /> */}
      
      <Header />
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <NotificationProvider>
          <Routes>
            {/* Основные страницы */}
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/anime/:id" element={<Details />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favorites" element={<Favorites />} />
            
            {/* Пользовательские страницы */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            
            {/* Админ страницы */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/anime" element={<AdminAnimePage />} />
            <Route path="/admin/comments" element={<AdminCommentsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/stats" element={<AdminStats />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </NotificationProvider>
      </main>
      
      <Footer />
      <ThemeToggle />
    </div>
  );
}

export default App;