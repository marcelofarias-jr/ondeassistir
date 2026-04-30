"use client";
import { useEffect, useRef, useState } from "react";
// Componente para poster com fallback de erro
function PosterWithFallback({ src, alt }: { src: string | null; alt: string }) {
  const [imgError, setImgError] = useState(false);
  if (src && !imgError) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="40px"
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-xs text-center p-1 leading-tight">
      Imagem
      <br />
      indisponível
    </div>
  );
}
import { X, Search, Star, Film, Tv } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { useSearch } from "@/hooks/useSearch";
import { getImageUrl } from "@/lib/tmdb";
import { formatYear } from "@/lib/utils";

interface Props {
  onClose: () => void;
}

export default function SearchModal({ onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, setQuery, results, isLoading } = useSearch();

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-60 flex flex-col items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Buscar conteúdo"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-2xl mt-20 mx-4">
        {/* Input */}
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-xl px-4 shadow-2xl">
          <Search size={20} className="text-zinc-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar filmes, séries, documentários..."
            className="flex-1 bg-transparent py-4 text-white placeholder-zinc-500 outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-zinc-500 hover:text-white transition-colors p-1"
              aria-label="Limpar busca"
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors p-1 ml-1"
            aria-label="Fechar"
          >
            <span className="text-xs border border-zinc-600 rounded px-1.5 py-0.5 font-mono">
              ESC
            </span>
          </button>
        </div>

        {/* Results */}
        {(results.length > 0 || isLoading || query.trim()) && (
          <div className="mt-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl max-h-[60vh] overflow-y-auto">
            {isLoading && (
              <div className="flex items-center justify-center py-8 text-zinc-500">
                <div className="w-5 h-5 border-2 border-zinc-600 border-t-[#e50914] rounded-full animate-spin" />
              </div>
            )}

            {!isLoading && query.trim() && results.length === 0 && (
              <div className="py-8 text-center text-zinc-500">
                Nenhum resultado para &ldquo;{query}&rdquo;
              </div>
            )}

            {!isLoading &&
              results.map((item) => {
                const poster = getImageUrl(item.posterPath, "w200");
                const year = formatYear(item.releaseDate);
                return (
                  <Link
                    key={item.id}
                    href={`/${item.mediaType}/${item.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-800 transition-colors border-b border-zinc-800 last:border-0"
                  >
                    {/* Poster */}
                    <div className="relative w-10 h-14 rounded overflow-hidden bg-zinc-800 shrink-0">
                      <PosterWithFallback src={poster} alt={item.title} />
                      <div className="absolute bottom-1 right-1">
                        {item.mediaType === "movie" ? (
                          <Film size={16} />
                        ) : (
                          <Tv size={16} />
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500">
                        <span>
                          {item.mediaType === "movie" ? "Filme" : "Série"}
                        </span>
                        {year && (
                          <>
                            <span>·</span>
                            <span>{year}</span>
                          </>
                        )}
                        <span>·</span>
                        <span className="flex items-center gap-1 text-yellow-500">
                          <Star size={9} fill="currentColor" />
                          {item.voteAverage.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="text-zinc-600 shrink-0" />
                  </Link>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

// missing import
function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
