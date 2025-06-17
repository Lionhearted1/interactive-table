import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FullScreenLoaderProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

export function FullScreenLoader({ isLoading, onLoadingComplete }: FullScreenLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check theme from localStorage first, then system preference
  useEffect(() => {
    const checkTheme = () => {
      // Check localStorage first
      const storedTheme = localStorage.getItem('theme');
      
      if (storedTheme === 'dark' || storedTheme === 'light') {
        setIsDarkMode(storedTheme === 'dark');
      } else {
        // Fall back to system preference
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(isDark);
      }
      
      // Apply theme to document root immediately
      if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    // Check initial theme
    checkTheme();

    // Listen for localStorage changes (theme switching)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        checkTheme();
      }
    };

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      // Only update if no theme is stored in localStorage
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    mediaQuery.addEventListener('change', handleMediaChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onLoadingComplete?.();
      }, 500); // Fade out duration
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, onLoadingComplete]);

  if (!isVisible && !isLoading) return null;

  const loadingGif = isDarkMode ? '/loading_dark.gif' : '/loading_light.gif';

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500',
        isLoading ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div className="flex items-center justify-center">
        <img
          src={loadingGif}
          alt="Loading..."
          className="h-56 w-56 sm:h-72 sm:w-72 object-contain"
          style={{ imageRendering: 'auto' }}
        />
      </div>
    </div>
  );
}