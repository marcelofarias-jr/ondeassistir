"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Star, Play } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { getImageUrl } from "@/lib/tmdb";
import { formatYear, mediaTypeLabel } from "@/lib/utils";

interface Props {
  item: MediaItem;
}

export default function Hero({ item }: Props) {
  const backdrop = getImageUrl(item.backdropPath, "original");
  const year = formatYear(item.releaseDate);
  const href = `/${item.mediaType}/${item.id}`;

  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative h-[80vh] min-h-130 flex items-end">
      {/* Backdrop image */}
      {backdrop && !imgError ? (
        <Image
          src={backdrop}
          alt={item.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
          <span className="text-zinc-500 text-lg">Imagem indisponível</span>
        </div>
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-linear-to-r from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/10 to-black/30" />

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-12 pb-20 max-w-3xl animate-slide-up">
        <div className="flex items-center gap-2 mb-3 text-sm text-zinc-400">
          <span className="flex items-center gap-1 text-yellow-400 font-bold">
            <Star size={13} fill="currentColor" />
            {item.voteAverage.toFixed(1)}
          </span>
          <span className="text-zinc-600">·</span>
          {year && <span>{year}</span>}
          <span className="text-zinc-600">·</span>
          <span>{mediaTypeLabel(item.mediaType)}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
          {item.title}
        </h1>

        <p className="text-zinc-300 text-base md:text-lg leading-relaxed mb-8 line-clamp-3 max-w-xl">
          {item.overview}
        </p>

        <div className="flex gap-3 flex-wrap">
          <Link
            href={href}
            className="flex items-center gap-2 bg-[#e50914] hover:bg-[#c8020f] text-white font-bold px-6 py-3 rounded-lg transition-colors text-sm"
          >
            <Play size={16} fill="currentColor" />
            Onde Assistir
          </Link>
        </div>
      </div>
    </section>
  );
}
