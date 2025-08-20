import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OverflowNav from '../src/components/layout/OverflowNav';

const mockItems = [
  { to: '/', label: 'Главная' },
  { to: '/catalog', label: 'Каталог' },
  { to: '/favorites', label: 'Избранное' },
  { to: '/profile', label: 'Профиль' },
  { to: '/settings', label: 'Настройки' },
];

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('OverflowNav', () => {
  beforeEach(() => {
    // Mock ResizeObserver to simulate enough space
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  it('renders all navigation items', () => {
    renderWithRouter(<OverflowNav items={mockItems} />);
    
    // All items should be visible
    expect(screen.getByText('Главная')).toBeInTheDocument();
    expect(screen.getByText('Каталог')).toBeInTheDocument();
    expect(screen.getByText('Избранное')).toBeInTheDocument();
    expect(screen.getByText('Профиль')).toBeInTheDocument();
    expect(screen.getByText('Настройки')).toBeInTheDocument();
    
    // "Ещё" button should not be present
    expect(screen.queryByText('Ещё')).not.toBeInTheDocument();
  });

  it('shows "Ещё" button when container is narrow', () => {
    // Mock ResizeObserver to simulate limited space
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn((callback) => {
        // Simulate limited space
        callback([{ contentRect: { width: 200 } }]);
      }),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    renderWithRouter(<OverflowNav items={mockItems} />);
    
    // "Ещё" button should appear
    expect(screen.getByText('Ещё')).toBeInTheDocument();
  });

  it('shows "Пусто" message when no items are hidden', () => {
    renderWithRouter(<OverflowNav items={mockItems} />);
    
    // Open the "Ещё" dropdown
    const moreButton = screen.getByText('Ещё');
    fireEvent.click(moreButton);
    
    // Should show "Пусто" message when no items are hidden
    expect(screen.getByText('Пусто')).toBeInTheDocument();
  });

  it('displays hidden items in dropdown when "Ещё" is clicked', () => {
    // Mock ResizeObserver to simulate limited space
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn((callback) => {
        // Simulate limited space
        callback([{ contentRect: { width: 200 } }]);
      }),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    renderWithRouter(<OverflowNav items={mockItems} />);
    
    // Open the "Ещё" dropdown
    const moreButton = screen.getByText('Ещё');
    fireEvent.click(moreButton);
    
    // Should not show "Пусто" message when items are hidden
    expect(screen.queryByText('Пусто')).not.toBeInTheDocument();
  });
});