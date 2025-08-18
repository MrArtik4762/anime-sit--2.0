import { Toaster } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Настройка уведомлений в зависимости от статуса пользователя
  const toastOptions = {
    position: 'top-right' as const,
    duration: 4000,
    style: {
      background: '#363636',
      color: '#fff',
    },
    success: {
      duration: 3000,
      style: {
        background: '#10b981',
        color: '#fff',
      },
    },
    error: {
      duration: 5000,
      style: {
        background: '#ef4444',
        color: '#fff',
      },
    },
  };

  return (
    <>
      {children}
      <Toaster {...toastOptions} />
    </>
  );
};

export default NotificationProvider;