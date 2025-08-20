import React, { useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

type Item = { to: string; label: string };
type Props = { items: Item[] };

export default function OverflowNav({ items }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visibleIdx, setVisibleIdx] = useState<number[]>(items.map((_, i) => i));
  const [hiddenIdx, setHiddenIdx] = useState<number[]>([]);
  const loc = useLocation();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const room = el.clientWidth - 120; // запас под кнопку «Ещё»
      const widths = Array.from(el.querySelectorAll<HTMLAnchorElement>("[data-nav-item]"))
        .map((a) => a.getBoundingClientRect().width + 16);
      let sum = 0;
      const v: number[] = [], h: number[] = [];
      widths.forEach((w, i) => { (sum + w <= room ? v : h).push(i); sum += w; });
      setVisibleIdx(v); setHiddenIdx(h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [items.length]);

  const visible = visibleIdx.map((i) => items[i]);
  const hidden = hiddenIdx.map((i) => items[i]);

  return (
    <div className="flex items-center gap-1" ref={ref}>
      {visible.map((it) => (
        <Link
          key={it.to}
          to={it.to}
          data-nav-item
          className={`px-3 py-2 rounded-xl ring-focus ${
            loc.pathname === it.to ? "bg-[hsl(var(--muted))]" : "hover:bg-[hsl(var(--muted))]"
          }`}
        >
          {it.label}
        </Link>
      ))}
      <details className="relative">
        <summary className="px-3 py-2 rounded-xl hover:bg-[hsl(var(--muted))] cursor-pointer select-none">Ещё</summary>
        <div className="absolute right-0 mt-2 w-56 surface bordered elev-1 rounded-xl p-2">
          {hidden.length === 0 ? (
            <div className="px-3 py-2 text-[hsl(var(--text-muted))]">Пусто</div>
          ) : (
            hidden.map((it) => (
              <Link key={it.to} to={it.to} className="block px-3 py-2 rounded-lg hover:bg-[hsl(var(--muted))]">
                {it.label}
              </Link>
            ))
          )}
        </div>
      </details>
    </div>
  );
}