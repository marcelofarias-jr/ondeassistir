import type { Metadata } from "next";
import MediaGrid from "@/components/MediaGrid";
import GenreFilter from "@/components/GenreFilter";
import Pagination from "@/components/Pagination";
import { discoverMedia } from "@/lib/tmdb";

const GENRES = [
  { id: null, label: "Todos" },
  { id: 28, label: "Ação" },
  { id: 12, label: "Aventura" },
  { id: 35, label: "Comédia" },
  { id: 80, label: "Crime" },
  { id: 18, label: "Drama" },
  { id: 878, label: "Ficção Científica" },
  { id: 27, label: "Terror" },
  { id: 53, label: "Thriller" },
  { id: 10749, label: "Romance" },
];

export const metadata: Metadata = {
  title: "Filmes — OndeAssistir",
  description: "Descubra onde assistir os melhores filmes no Brasil.",
};

export default async function FilmesPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; page?: string }>;
}) {
  const params = await searchParams;
  const genreId = params.genre ? parseInt(params.genre, 10) : null;
  const page = params.page ? Math.max(1, parseInt(params.page, 10)) : 1;

  const data = await discoverMedia("movie", genreId, page);
  const extraParams: Record<string, string> = {};
  if (genreId) extraParams.genre = String(genreId);

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-6">Filmes</h1>

        <div className="mb-8">
          <GenreFilter
            genres={GENRES}
            currentGenre={genreId}
            baseHref="/filmes"
          />
        </div>

        <MediaGrid
          items={data.results}
          emptyMessage="Nenhum filme encontrado para esse gênero."
        />

        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          baseHref="/filmes"
          extraParams={extraParams}
        />
      </div>
    </main>
  );
}
