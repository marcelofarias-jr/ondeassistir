"use client";

import { useState } from "react";
import type { Video } from "@/lib/types";
import { Play } from "lucide-react";

interface Props {
  videos: Video[];
  title: string;
}

export default function TrailerEmbed({ videos, title }: Props) {
  const [loaded, setLoaded] = useState(false);

  const trailer =
    videos.find(
      (v) =>
        v.site === "YouTube" &&
        (v.type === "Trailer" || v.type === "Teaser") &&
        v.official,
    ) ?? videos.find((v) => v.site === "YouTube");

  if (!trailer) return null;

  const thumbUrl = `https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`;

  return (
    <div>
      <h2 className="text-white font-bold text-xl mb-4">Trailer</h2>
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-900">
        {loaded ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1`}
            title={`Trailer — ${title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <button
            onClick={() => setLoaded(true)}
            className="absolute inset-0 w-full h-full group cursor-pointer"
            aria-label={`Reproduzir trailer de ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbUrl}
              alt={`Thumbnail do trailer de ${title}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-xl transition-all group-hover:scale-110">
                <Play className="w-7 h-7 text-black fill-black ml-1" />
              </div>
            </div>
            <p className="absolute bottom-3 left-4 text-xs text-white/70 bg-black/50 px-2 py-0.5 rounded">
              {trailer.name}
            </p>
          </button>
        )}
      </div>
    </div>
  );
}
