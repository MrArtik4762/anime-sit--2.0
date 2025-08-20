import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useAuth } from '../hooks/useAuth';

interface AdminStats {
  overview: {
    totalUsers: number;
    totalComments: number;
    totalFavorites: number;
    totalWatchLater: number;
  };
  recent: {
    newUsersLastWeek: number;
    newCommentsLastWeek: number;
    recentUsers: Array<{
      username: string;
      email: string;
      createdAt: string;
    }>;
    recentComments: Array<{
      text: string;
      createdAt: string;
      userId: {
        username: string;
      };
    }>;
  };
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/profile');
      return;
    }

    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://api.anilibria.tv'}/api/admin/stats`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const chartData = [
    { name: 'Пользователи', value: stats?.overview.totalUsers || 0 },
    { name: 'Комментарии', value: stats?.overview.totalComments || 0 },
    { name: 'Избранное', value: stats?.overview.totalFavorites || 0 },
    { name: 'Смотреть позже', value: stats?.overview.totalWatchLater || 0 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar onLogout={handleLogout} />
        <div className="flex-1 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar onLogout={handleLogout} />
      
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Админ-панель</h1>
          <p className="text-gray-600">Добро пожаловать, {user?.username}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Пользователи</p>
                <p className="text-2xl font-bold">{stats?.overview.totalUsers || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">💬</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Комментарии</p>
                <p className="text-2xl font-bold">{stats?.overview.totalComments || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Избранное</p>
                <p className="text-2xl font-bold">{stats?.overview.totalFavorites || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">📺</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Смотреть позже</p>
                <p className="text-2xl font-bold">{stats?.overview.totalWatchLater || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Распределение по категориям</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Активность за неделю</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Новые пользователи', value: stats?.recent.newUsersLastWeek || 0 },
                { name: 'Новые комментарии', value: stats?.recent.newCommentsLastWeek || 0 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Новые пользователи</h3>
            <div className="space-y-3">
              {stats?.recent.recentUsers?.map((recentUser, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{recentUser.username}</p>
                    <p className="text-sm text-gray-600">{recentUser.email}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(recentUser.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Последние комментарии</h3>
            <div className="space-y-3">
              {stats?.recent.recentComments?.map((recentComment, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 mb-1">
                    {recentComment.userId.username}
                  </p>
                  <p className="text-sm">{recentComment.text}</p>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {new Date(recentComment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;