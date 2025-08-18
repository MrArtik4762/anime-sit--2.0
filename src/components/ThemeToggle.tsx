import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setTheme(theme === "dark" ? "light" : "dark");
        }
      }}
      className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg hover:shadow-purple-500/25 focus:shadow-lg focus:shadow-purple-500/25 interactive-element relative overflow-hidden"
      aria-label="Переключить тему"
      aria-pressed={theme === "dark"}
      title={theme === "dark" ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Анимированный фон при переключении */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0"
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
        {theme === "dark" ? (
          <SunIcon className="h-6 w-6 text-yellow-400" />
        ) : (
          <MoonIcon className="h-6 w-6 text-slate-800" />
        )}
      </motion.div>
    </motion.button>
  );
}