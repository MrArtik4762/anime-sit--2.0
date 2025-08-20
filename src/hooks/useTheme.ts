import { useEffect, useState, useCallback } from "react";
type Theme = "light" | "dark" | "system";
const STORAGE_KEY = "theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(STORAGE_KEY) as Theme) || "system");

  const apply = useCallback((t: Theme) => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved: "light" | "dark" = t === "system" ? (prefersDark ? "dark" : "light") : t;
    root.setAttribute("data-theme", resolved);
    (root as HTMLElement).style.colorScheme = resolved;
  }, []);

  useEffect(() => {
    apply(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, apply]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => theme === "system" && apply("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme, apply]);

  const cycleTheme = useCallback(() => {
    const themes: Theme[] = ["dark", "light", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  }, [theme]);

  return { theme, setTheme, cycleTheme };
}