import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

interface FullScreenLoaderProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

export function FullScreenLoader({ isLoading, onLoadingComplete }: FullScreenLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { isDarkMode } = useTheme();

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
          className="h-72 w-72 sm:h-80 sm:w-80 object-contain"
          style={{ imageRendering: 'auto' }}
        />
      </div>
    </div>
  );
}