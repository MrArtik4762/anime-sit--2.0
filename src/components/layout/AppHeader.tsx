import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import OverflowNav from "./OverflowNav";
import { useTheme } from "../../hooks/useTheme";

const MAIN = [
  { to: "/", label: "Главная" },
  { to: "/catalog", label: "Каталог" },
  { to: "/favorites", label: "Избранное" },
];
const SECONDARY = [
  { to: "/profile", label: "Профиль" },
  { to: "/friends", label: "Друзья" },
  { to: "/activity", label: "Активность" },
  { to: "/achievements", label: "Достижения" },
  { to: "/settings", label: "Настройки" },
];

export default function AppHeader() {
  const { theme, setTheme } = useTheme();
  const cycle = () => setTheme(theme === "dark" ? "light" : theme === "light" ? "system" : "dark");

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        const input = document.querySelector<HTMLInputElement>('input[aria-label="Поиск"]');
        input?.focus(); e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bordered surface backdrop-blur">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="h-14 flex items-center justify-between gap-2">
          {/* Левая часть: логотип + основное меню */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-[hsl(var(--muted))]">
              <span className="inline-block w-7 h-7 rounded-xl bg-[hsl(var(--primary))]" />
              <span className="font-semibold">AnimeSite</span>
            </Link>
            <nav aria-label="Главное меню" className="hidden md:block">
              <OverflowNav items={MAIN} />
            </nav>
          </div>

          {/* Правая часть: поиск + тема + уведомления + профиль */}
          <div className="flex items-center gap-2">
            <form role="search" className="hidden sm:flex items-center">
              <input
                className="h-9 w-56 md:w-72 px-3 rounded-xl bordered bg-[hsl(var(--surface))] ring-focus"
                placeholder="Поиск (Ctrl+K)"
                aria-label="Поиск"
              />
            </form>

            <button title="Сменить тему" className="btn btn-ghost ring-focus" onClick={cycle}><span aria-hidden>🌓</span></button>
            <button title="Уведомления" className="btn btn-ghost ring-focus"><span aria-hidden>🔔</span></button>

            <details className="relative">
              <summary className="btn btn-ghost rounded-full w-9 h-9 overflow-hidden ring-focus">
                <span className="sr-only">Открыть меню профиля</span>
                <span aria-hidden className="inline-block w-7 h-7 rounded-full bg-[hsl(var(--muted))]" />
              </summary>
              <div className="absolute right-0 mt-2 w-64 surface bordered elev-1 rounded-xl p-2">
                <div className="px-3 py-2 text-sm text-[hsl(var(--text-muted))]">Навигация профиля</div>
                {SECONDARY.map((it) => (
                  <Link key={it.to} to={it.to} className="block px-3 py-2 rounded-lg hover:bg-[hsl(var(--muted))]">
                    {it.label}
                  </Link>
                ))}
                <div className="h-px my-2 bg-[hsl(var(--border))]" />
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-[hsl(var(--muted))]">Выйти</button>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}