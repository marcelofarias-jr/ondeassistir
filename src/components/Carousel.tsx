"use client";
import { useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import MediaCard from "./MediaCard";
import Link from "next/link";

interface Props {
  title: string;
  items: MediaItem[];
  viewAllHref?: string;
}

export default function Carousel({ title, items, viewAllHref }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "right" ? el.clientWidth * 0.75 : -(el.clientWidth * 0.75),
      behavior: "smooth",
    });
  };

  if (!items.length) return null;

  return (
    <section className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 md:px-8">
        <h2 className="text-lg md:text-xl font-bold text-white">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm text-[#e50914] hover:text-[#f87171] font-medium transition-colors"
          >
            Ver todos →
          </Link>
        )}
      </div>

      {/* Scroll container with arrows */}
      <div className="relative group/carousel">
        {/* Left arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            aria-label="Rolar para a esquerda"
            className="absolute left-0 top-1/2 -translate-y-8 z-10 h-full w-12 flex items-center justify-center bg-linear-to-r from-black to-transparent text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          >
            <span className="bg-black/80 rounded-full p-1">
              <ChevronLeft size={22} />
            </span>
          </button>
        )}

        {/* Cards */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-3 overflow-x-auto px-4 md:px-8 pb-3"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>

        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            aria-label="Rolar para a direita"
            className="absolute right-0 top-1/2 -translate-y-8 z-10 h-full w-12 flex items-center justify-center bg-linear-to-l from-black to-transparent text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          >
            <span className="bg-black/80 rounded-full p-1">
              <ChevronRight size={22} />
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
