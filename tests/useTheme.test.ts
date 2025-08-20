import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../src/hooks/useTheme';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

// Mock window.matchMedia
const matchMediaMock = {
  matches: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});

describe('useTheme', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    (window.matchMedia as any).mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  it('should initialize with default theme', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe('system');
  });

  it('should initialize with saved theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe('dark');
  });

  it('should set theme to dark', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('dark');
    });
    
    expect(result.current.theme).toBe('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should set theme to light', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('light');
    });
    
    expect(result.current.theme).toBe('light');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('should set theme to system', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('system');
    });
    
    expect(result.current.theme).toBe('system');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'system');
  });

  it('should cycle through themes correctly', () => {
    const { result } = renderHook(() => useTheme());
    
    // Start with 'system'
    expect(result.current.theme).toBe('system');
    
    // Cycle to 'dark'
    act(() => {
      result.current.cycleTheme();
    });
    expect(result.current.theme).toBe('dark');
    
    // Cycle to 'light'
    act(() => {
      result.current.cycleTheme();
    });
    expect(result.current.theme).toBe('light');
    
    // Cycle back to 'system'
    act(() => {
      result.current.cycleTheme();
    });
    expect(result.current.theme).toBe('system');
  });

  it('should handle media query changes when theme is system', () => {
    const { result } = renderHook(() => useTheme());
    
    // Set theme to system
    act(() => {
      result.current.setTheme('system');
    });
    
    // Simulate media query change
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    Object.defineProperty(mediaQuery, 'dispatchEvent', {
      value: vi.fn(),
    });
    
    act(() => {
      mediaQuery.dispatchEvent(new Event('change'));
    });
    
    // Theme should still be system, but it should have been reapplied
    expect(result.current.theme).toBe('system');
  });

  it('should not react to media query changes when theme is not system', () => {
    const { result } = renderHook(() => useTheme());
    
    // Set theme to dark
    act(() => {
      result.current.setTheme('dark');
    });
    
    // Simulate media query change
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    Object.defineProperty(mediaQuery, 'dispatchEvent', {
      value: vi.fn(),
    });
    
    act(() => {
      mediaQuery.dispatchEvent(new Event('change'));
    });
    
    // Theme should remain dark
    expect(result.current.theme).toBe('dark');
  });
});