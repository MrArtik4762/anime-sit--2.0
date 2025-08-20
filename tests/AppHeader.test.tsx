import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AppHeader from '../src/components/layout/AppHeader';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AppHeader', () => {
  it('renders with active link', () => {
    renderWithRouter(<AppHeader />);
    
    // Check if main navigation links are present
    expect(screen.getByText('AnimeSite')).toBeInTheDocument();
    expect(screen.getByText('Главная')).toBeInTheDocument();
    expect(screen.getByText('Каталог')).toBeInTheDocument();
    expect(screen.getByText('Избранное')).toBeInTheDocument();
    
    // Check if theme toggle button is present
    expect(screen.getByTitle('Сменить тему')).toBeInTheDocument();
    
    // Check if notifications button is present
    expect(screen.getByTitle('Уведомления')).toBeInTheDocument();
    
    // Check if profile menu is present
    expect(screen.getByText('Открыть меню профиля')).toBeInTheDocument();
  });

  it('renders search input', () => {
    renderWithRouter(<AppHeader />);
    
    // Search input should be present with correct attributes
    const searchInput = screen.getByPlaceholderText('Поиск (Ctrl+K)');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('aria-label', 'Поиск');
  });

  it('renders secondary navigation links in profile menu', () => {
    renderWithRouter(<AppHeader />);
    
    // Profile menu should be present
    const profileMenu = screen.getByText('Открыть меню профиля');
    expect(profileMenu).toBeInTheDocument();
    
    // Secondary navigation links should be present in the DOM
    expect(screen.getByText('Профиль')).toBeInTheDocument();
    expect(screen.getByText('Друзья')).toBeInTheDocument();
    expect(screen.getByText('Активность')).toBeInTheDocument();
    expect(screen.getByText('Достижения')).toBeInTheDocument();
    expect(screen.getByText('Настройки')).toBeInTheDocument();
    expect(screen.getByText('Доступность')).toBeInTheDocument();
  });
});