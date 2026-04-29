import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { getImageUrl } from "@/lib/tmdb";
import { formatYear } from "@/lib/utils";

interface Props {
  item: MediaItem;
}

export default function MediaCard({ item }: Props) {
  const poster = getImageUrl(item.posterPath, "w300");
  const year = formatYear(item.releaseDate);

  return (
    <Link
      href={`/${item.mediaType}/${item.id}`}
      className="group shrink-0 w-37.5 sm:w-42.5 md:w-47.5 animate-slide-up"
    >
      <div className="relative aspect-2/3 rounded-lg overflow-hidden bg-zinc-900">
        {poster ? (
          <Image
            src={poster}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 150px, (max-width: 768px) 170px, 190px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 text-zinc-500 text-xs text-center p-2">
            {item.title}
          </div>
        )}

        {/* Rating badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5 text-xs font-bold text-yellow-400">
          <Star size={9} fill="currentColor" />
          {item.voteAverage.toFixed(1)}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#e50914]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      <div className="mt-2 px-0.5">
        <p className="text-sm font-semibold text-white line-clamp-2 leading-snug">
          {item.title}
        </p>
        {year && <p className="text-xs text-zinc-500 mt-0.5">{year}</p>}
      </div>
    </Link>
  );
}
