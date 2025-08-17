import { useTheme } from "../hooks/useTheme";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setTheme(theme === "dark" ? "light" : "dark");
        }
      }}
      className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25 focus:shadow-lg focus:shadow-purple-500/25 interactive-element"
      aria-label="Переключить тему"
      aria-pressed={theme === "dark"}
      title={theme === "dark" ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
    >
      {theme === "dark" ? (
        <SunIcon className="h-6 w-6 text-yellow-400" />
      ) : (
        <MoonIcon className="h-6 w-6 text-slate-800" />
      )}
    </button>
  );
}