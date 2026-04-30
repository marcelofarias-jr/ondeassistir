// Componente para poster com fallback de erro
function PosterWithFallback({ src, alt }: { src: string | null; alt: string }) {
  const [imgError, setImgError] = useState(false);
  if (src && !imgError) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="128px"
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs text-center p-1 leading-tight">
      Imagem
      <br />
      indisponível
    </div>
  );
}
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { MediaItem } from "@/lib/types";
import { getImageUrl } from "@/lib/tmdb";
import { Star } from "lucide-react";

interface Props {
  items: MediaItem[];
  mediaType: string;
}

export default function SimilarContent({ items, mediaType }: Props) {
  if (!items.length) return null;

  const visible = items.slice(0, 12);

  return (
    <div>
      <h2 className="text-white font-bold text-xl mb-4">Títulos Semelhantes</h2>
      <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
        <div className="flex gap-4" style={{ width: "max-content" }}>
          {visible.map((item) => {
            const poster = getImageUrl(item.posterPath, "w300");
            const href = `/${mediaType}/${item.id}`;
            const year = item.releaseDate
              ? new Date(item.releaseDate).getFullYear()
              : null;
            return (
              <Link key={item.id} href={href} className="w-32 shrink-0 group">
                <div className="relative w-32 aspect-2/3 rounded-xl overflow-hidden bg-zinc-800 mb-2 border border-zinc-700">
                  <PosterWithFallback src={poster} alt={item.title} />
                  {item.voteAverage > 0 && (
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/70 rounded-full px-1.5 py-0.5">
                      <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-[10px] font-bold">
                        {item.voteAverage.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-white text-xs font-semibold leading-snug line-clamp-2">
                  {item.title}
                </p>
                {year && (
                  <p className="text-zinc-500 text-[10px] mt-0.5">{year}</p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
