import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useRef } from "react";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

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

      toggleTheme();

      setTimeout(() => {
        transition.remove();
      }, 500);
    } else {
      toggleTheme();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">Product Manager</span>
        </div>
        <Button
          ref={buttonRef}
          variant="ghost"
          size="icon"
          onClick={handleThemeChange}
          className="relative overflow-hidden"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
} 