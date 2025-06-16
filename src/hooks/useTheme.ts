import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    
    // Remove both classes first
    root.classList.remove("light", "dark");
    body.classList.remove("light", "dark");
    
    // Add the current theme class to both
    root.classList.add(theme);
    body.classList.add(theme);
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
} 