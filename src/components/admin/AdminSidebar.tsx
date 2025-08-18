import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AdminSidebarProps {
  onLogout?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Главная', icon: '📊' },
    { path: '/admin/users', label: 'Пользователи', icon: '👥' },
    { path: '/admin/anime', label: 'Аниме', icon: '🎬' },
    { path: '/admin/comments', label: 'Комментарии', icon: '💬' },
    { path: '/admin/stats', label: 'Статистика', icon: '📈' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center">Админ-панель</h1>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
        >
          <span className="text-xl">🚪</span>
          <span>Выход</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;