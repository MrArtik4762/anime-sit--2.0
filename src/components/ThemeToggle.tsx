import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();

  const getIcon = () => {
    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? <MoonIcon className="h-6 w-6 text-slate-800" /> : <SunIcon className="h-6 w-6 text-yellow-400" />;
    }
    return theme === "dark" ? <SunIcon className="h-6 w-6 text-yellow-400" /> : <MoonIcon className="h-6 w-6 text-slate-800" />;
  };

  const getAriaLabel = () => {
    switch (theme) {
      case "dark": return "Переключить на светлую тему";
      case "light": return "Переключить на системную тему";
      case "system": return "Переключить на тёмную тему";
      default: return "Переключить тему";
    }
  };

  const getAriaPressed = () => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return theme === "dark" || (theme === "system" && prefersDark);
  };

  return (
    <motion.button
      onClick={cycleTheme}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          cycleTheme();
        }
      }}
      className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25 focus:shadow-lg focus:shadow-purple-500/25 interactive-element relative overflow-hidden"
      aria-label="Переключить тему"
      aria-pressed={getAriaPressed()}
      title={getAriaLabel()}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Анимированный фон при переключении */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))]/80 opacity-0"
        initial={false}
        animate={{
          opacity: theme === "dark" ? 0 : 1,
          scale: theme === "dark" ? 0.8 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
      />
      
      {/* Иконка с анимацией вращения */}
      <motion.div
        key={theme}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{
          rotate: 0,
          opacity: 1,
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          times: [0, 0.5, 1]
        }}
        className="relative z-10"
      >
        {getIcon()}
      </motion.div>
    </motion.button>
  );
}