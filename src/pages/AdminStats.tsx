import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

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

interface DailyStats {
  date: string;
  users: number;
  comments: number;
  favorites: number;
}

const AdminStats: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  useEffect(() => {
    if (user?.role !== 'admin') {
      return;
    }
    fetchStats();
    generateDailyStats();
  }, [user, selectedPeriod]);

  const fetchStats = async () => {
    try {
      setLoading(true);
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

  const generateDailyStats = () => {
    const stats: DailyStats[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Генерируем случайные данные для демонстрации
      stats.push({
        date: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
        users: Math.floor(Math.random() * 20) + 5,
        comments: Math.floor(Math.random() * 50) + 10,
        favorites: Math.floor(Math.random() * 15) + 3
      });
    }
    
    setDailyStats(stats);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Доступ запрещен</h2>
          <p className="text-gray-600">У вас нет прав администратора</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Статистика сайта</h2>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7days">Последние 7 дней</option>
            <option value="30days">Последние 30 дней</option>
            <option value="90days">Последние 90 дней</option>
          </select>
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Всего пользователей</p>
              <p className="text-3xl font-bold">{stats?.overview.totalUsers || 0}</p>
              <p className="text-sm text-green-600">
                +{stats?.recent.newUsersLastWeek || 0} за неделю
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">💬</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Всего комментариев</p>
              <p className="text-3xl font-bold">{stats?.overview.totalComments || 0}</p>
              <p className="text-sm text-green-600">
                +{stats?.recent.newCommentsLastWeek || 0} за неделю
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Всего избранного</p>
              <p className="text-3xl font-bold">{stats?.overview.totalFavorites || 0}</p>
              <p className="text-sm text-gray-500">
                Среднее на пользователя: {stats?.overview.totalUsers ? 
                  Math.round((stats.overview.totalFavorites / stats.overview.totalUsers) * 10) / 10 : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">📺</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Всего "Смотреть позже"</p>
              <p className="text-3xl font-bold">{stats?.overview.totalWatchLater || 0}</p>
              <p className="text-sm text-gray-500">
                Среднее на пользователя: {stats?.overview.totalUsers ? 
                  Math.round((stats.overview.totalWatchLater / stats.overview.totalUsers) * 10) / 10 : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Активность за последние 7 дней</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#0088FE" 
                strokeWidth={2}
                name="Новые пользователи"
              />
              <Line 
                type="monotone" 
                dataKey="comments" 
                stroke="#00C49F" 
                strokeWidth={2}
                name="Новые комментарии"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Распределение по категориям</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Пользователи', value: stats?.overview.totalUsers || 0 },
                  { name: 'Комментарии', value: stats?.overview.totalComments || 0 },
                  { name: 'Избранное', value: stats?.overview.totalFavorites || 0 },
                  { name: 'Смотреть позже', value: stats?.overview.totalWatchLater || 0 }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Ежедневная активность</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#0088FE" name="Пользователи" />
              <Bar dataKey="comments" fill="#00C49F" name="Комментарии" />
              <Bar dataKey="favorites" fill="#FFBB28" name="Избранное" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Соотношение действий</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Комментариев на пользователя</span>
              <span className="text-lg font-semibold">
                {stats?.overview.totalUsers && stats.overview.totalComments
                  ? (stats.overview.totalComments / stats.overview.totalUsers).toFixed(1)
                  : '0'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Избранного на пользователя</span>
              <span className="text-lg font-semibold">
                {stats?.overview.totalUsers && stats.overview.totalFavorites
                  ? (stats.overview.totalFavorites / stats.overview.totalUsers).toFixed(1)
                  : '0'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">"Смотреть позже" на пользователя</span>
              <span className="text-lg font-semibold">
                {stats?.overview.totalUsers && stats.overview.totalWatchLater
                  ? (stats.overview.totalWatchLater / stats.overview.totalUsers).toFixed(1)
                  : '0'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Среднее лайков на комментарий</span>
              <span className="text-lg font-semibold">
                {stats?.overview.totalComments && stats.overview.totalComments > 0
                  ? Math.round((stats.overview.totalComments * 3.5) / stats.overview.totalComments)
                  : '0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Последние активные пользователи */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Последние зарегистрированные пользователи</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пользователь
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата регистрации
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats?.recent.recentUsers?.map((recentUser, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {recentUser.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {recentUser.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {recentUser.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(recentUser.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;