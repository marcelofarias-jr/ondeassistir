import Link from "next/link";
import clsx from "clsx";

interface Genre {
  id: number | null;
  label: string;
}

interface Props {
  genres: Genre[];
  currentGenre: number | null;
  baseHref: string;
}

export default function GenreFilter({ genres, currentGenre, baseHref }: Props) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2"
      style={{ scrollbarWidth: "none" }}
    >
      {genres.map((g) => {
        const isActive = g.id === currentGenre;
        const href = g.id === null ? baseHref : `${baseHref}?genre=${g.id}`;
        return (
          <Link
            key={g.id ?? "all"}
            href={href}
            className={clsx(
              "shrink-0 text-sm font-medium px-4 py-1.5 rounded-full border transition-colors",
              isActive
                ? "bg-[#e50914] border-[#e50914] text-white"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-400 hover:text-white",
            )}
          >
            {g.label}
          </Link>
        );
      })}
    </div>
  );
}
