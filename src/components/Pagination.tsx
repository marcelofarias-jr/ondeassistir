import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  currentPage: number;
  totalPages: number;
  baseHref: string;
  /** searchParams existentes (genre, etc.) para preservar no link */
  extraParams?: Record<string, string>;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseHref,
  extraParams = {},
}: Props) {
  if (totalPages <= 1) return null;

  const capped = Math.min(totalPages, 500); // TMDB limita a 500 páginas

  function buildHref(page: number) {
    const params = new URLSearchParams({ ...extraParams, page: String(page) });
    return `${baseHref}?${params.toString()}`;
  }

  // Gera janela de páginas em torno da atual
  const pages: number[] = [];
  const delta = 2;
  for (
    let i = Math.max(1, currentPage - delta);
    i <= Math.min(capped, currentPage + delta);
    i++
  ) {
    pages.push(i);
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < capped;

  return (
    <nav
      className="flex items-center justify-center gap-1.5 mt-10"
      aria-label="Paginação"
    >
      <Link
        href={buildHref(currentPage - 1)}
        aria-label="Página anterior"
        aria-disabled={!hasPrev}
        tabIndex={hasPrev ? undefined : -1}
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-lg border border-zinc-800 transition-colors",
          hasPrev
            ? "text-zinc-300 hover:bg-zinc-800 hover:text-white"
            : "text-zinc-700 pointer-events-none",
        )}
      >
        <ChevronLeft size={16} />
      </Link>

      {pages[0] > 1 && (
        <>
          <Link
            href={buildHref(1)}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            1
          </Link>
          {pages[0] > 2 && (
            <span className="text-zinc-700 px-1 select-none">…</span>
          )}
        </>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          aria-current={p === currentPage ? "page" : undefined}
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-lg text-sm transition-colors",
            p === currentPage
              ? "bg-[#e50914] text-white font-semibold pointer-events-none"
              : "text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-white",
          )}
        >
          {p}
        </Link>
      ))}

      {pages[pages.length - 1] < capped && (
        <>
          {pages[pages.length - 1] < capped - 1 && (
            <span className="text-zinc-700 px-1 select-none">…</span>
          )}
          <Link
            href={buildHref(capped)}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors border border-zinc-800"
          >
            {capped}
          </Link>
        </>
      )}

      <Link
        href={buildHref(currentPage + 1)}
        aria-label="Próxima página"
        aria-disabled={!hasNext}
        tabIndex={hasNext ? undefined : -1}
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-lg border border-zinc-800 transition-colors",
          hasNext
            ? "text-zinc-300 hover:bg-zinc-800 hover:text-white"
            : "text-zinc-700 pointer-events-none",
        )}
      >
        <ChevronRight size={16} />
      </Link>
    </nav>
  );
}
