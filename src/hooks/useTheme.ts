import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;

    // Remove both classes first
    root.classList.remove("light", "dark");
    body.classList.remove("light", "dark");

    // Add the current theme class
    root.classList.add(theme);
    body.classList.add(theme);

    // Set data-theme attribute
    root.setAttribute("data-theme", theme);

    // Store theme in localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
} 