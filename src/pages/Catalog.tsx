import React, { useEffect, useState } from "react";
import CardSkeleton from "../components/CardSkeleton";

interface Anime {
  _id: string;
  title: string;
  description: string;
  image: string;
}

export default function Catalog() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/anime");
        if (!response.ok) {
          throw new Error("Ошибка сети");
        }
        const data = await response.json();
        setAnimes(data);
      } catch (error) {
        console.error("Ошибка загрузки каталога:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimes();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Каталог аниме</h2>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))
        ) : animes.length > 0 ? (
          animes.map((anime) => (
            <div
              key={anime._id}
              className="rounded-xl bordered p-3 bg-[hsl(var(--surface))]"
            >
              <img
                src={anime.image}
                alt={anime.title}
                className="w-full h-40 object-cover rounded-lg mb-2"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.jpg";
                }}
              />
              <h3 className="font-medium">{anime.title}</h3>
              <p className="text-sm text-[hsl(var(--text-muted))] line-clamp-3">
                {anime.description}
              </p>
            </div>
          ))
        ) : (
          <p className="text-[hsl(var(--text-muted))] col-span-full">
            Каталог пуст или сервер не отвечает.
          </p>
        )}
      </div>
    </div>
  );
}