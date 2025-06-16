import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FullScreenLoaderProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

export function FullScreenLoader({ isLoading, onLoadingComplete }: FullScreenLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);

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

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500',
        isLoading ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <img
          src="/logo-dark.svg"
          alt="Loading..."
          className="h-16 w-16 animate-pulse"
        />
        <p className="text-lg font-medium text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
} 