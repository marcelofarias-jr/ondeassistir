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
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; scrollLeft: number } | null>(null);
  const dragMoved = useRef(false);

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
      left:
        direction === "right"
          ? el.clientWidth * 0.75
          : -(el.clientWidth * 0.75),
      behavior: "smooth",
    });
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    dragMoved.current = false;
    dragStart.current = { x: e.pageX, scrollLeft: el.scrollLeft };
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = e.pageX - dragStart.current.x;
    if (Math.abs(dx) > 4) dragMoved.current = true;
    el.scrollLeft = dragStart.current.scrollLeft - dx;
  };

  const onMouseUp = () => {
    dragStart.current = null;
    setIsDragging(false);
  };

  // Prevent click on child links when drag happened
  const onClickCapture = (e: React.MouseEvent) => {
    if (dragMoved.current) e.stopPropagation();
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
            className="absolute left-0 top-0 z-10 h-full w-14 flex items-center justify-center bg-linear-to-r from-black/70 to-transparent text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          >
            <span className="bg-black/70 rounded-full p-2 shadow-lg">
              <ChevronLeft size={32} strokeWidth={2.5} />
            </span>
          </button>
        )}

        {/* Cards */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onClickCapture={onClickCapture}
          className={`flex gap-3 overflow-x-auto px-4 md:px-8 pb-3 select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
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
            className="absolute right-0 top-0 z-10 h-full w-14 flex items-center justify-center bg-linear-to-l from-black/70 to-transparent text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          >
            <span className="bg-black/70 rounded-full p-2 shadow-lg">
              <ChevronRight size={32} strokeWidth={2.5} />
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
