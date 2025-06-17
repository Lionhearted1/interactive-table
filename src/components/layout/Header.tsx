import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useRef, useState, useEffect } from "react";

export function Header() {
  const { toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check theme from localStorage first, then system preference
  useEffect(() => {
    const checkTheme = () => {
      const storedTheme = localStorage.getItem('theme');
      
      if (storedTheme === 'dark' || storedTheme === 'light') {
        setIsDarkMode(storedTheme === 'dark');
      } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(isDark);
      }
    };

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
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    mediaQuery.addEventListener('change', handleMediaChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  const handleThemeChange = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      const transition = document.createElement("div");
      transition.className = "theme-transition";
      transition.style.setProperty("--x", `${x}px`);
      transition.style.setProperty("--y", `${y}px`);
      
      document.body.appendChild(transition);
      
      // Toggle theme immediately for smooth transition
      toggleTheme();
      
      // Update logo state immediately for instant switch
      setIsDarkMode(!isDarkMode);
      
      setTimeout(() => {
        transition.remove();
      }, 500);
    } else {
      toggleTheme();
      setIsDarkMode(!isDarkMode);
    }
  };

  const logoSrc = isDarkMode ? '/logo_dark.png' : '/logo_light.png';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-12xl">
        <div className="flex items-center">
          <img
            src={logoSrc}
            alt="Logo"
            className="h-10 w-auto object-contain transition-opacity duration-300"
            style={{ imageRendering: 'auto' }}
          />
        </div>
        
        <Button
          ref={buttonRef}
          variant="ghost"
          size="icon"
          onClick={handleThemeChange}
          className="relative overflow-hidden rounded-full h-9 w-9 hover:bg-accent transition-colors duration-200"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}