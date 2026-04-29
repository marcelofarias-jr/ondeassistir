import type { Metadata } from "next";
import MediaGrid from "@/components/MediaGrid";
import GenreFilter from "@/components/GenreFilter";
import Pagination from "@/components/Pagination";
import { discoverMedia } from "@/lib/tmdb";

const GENRES = [
  { id: null, label: "Todas" },
  { id: 10765, label: "Ficção Científica" },
  { id: 18, label: "Drama" },
  { id: 80, label: "Crime" },
  { id: 9648, label: "Mistério" },
  { id: 10749, label: "Romance" },
  { id: 27, label: "Terror" },
  { id: 53, label: "Thriller" },
  { id: 35, label: "Comédia" },
  { id: 12, label: "Aventura" },
];

export const metadata: Metadata = {
  title: "Séries — OndeAssistir",
  description: "Descubra onde assistir as melhores séries no Brasil.",
};

export default async function SeriesPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; page?: string }>;
}) {
  const params = await searchParams;
  const genreId = params.genre ? parseInt(params.genre, 10) : null;
  const page = params.page ? Math.max(1, parseInt(params.page, 10)) : 1;

  const data = await discoverMedia("tv", genreId, page);
  const extraParams: Record<string, string> = {};
  if (genreId) extraParams.genre = String(genreId);

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-6">Séries</h1>

        <div className="mb-8">
          <GenreFilter
            genres={GENRES}
            currentGenre={genreId}
            baseHref="/series"
          />
        </div>

        <MediaGrid
          items={data.results}
          emptyMessage="Nenhuma série encontrada para esse gênero."
        />

        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          baseHref="/series"
          extraParams={extraParams}
        />
      </div>
    </main>
  );
}
