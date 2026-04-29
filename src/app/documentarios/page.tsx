import type { Metadata } from "next";
import MediaGrid from "@/components/MediaGrid";
import Pagination from "@/components/Pagination";
import { discoverMedia } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Documentários — OndeAssistir",
  description: "Descubra onde assistir os melhores documentários no Brasil.",
};

export default async function DocumentariosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? Math.max(1, parseInt(params.page, 10)) : 1;

  // Documentários: gênero 99 em filmes e séries
  const [tvDocs, movieDocs] = await Promise.all([
    discoverMedia("tv", 99, page),
    discoverMedia("movie", 99, page),
  ]);

  const all = [...tvDocs.results, ...movieDocs.results];
  const totalPages = Math.max(tvDocs.totalPages, movieDocs.totalPages);

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-2">Documentários</h1>
        <p className="text-zinc-500 mb-8 text-sm">
          Filmes e séries documentais disponíveis no Brasil
        </p>

        <MediaGrid items={all} emptyMessage="Nenhum documentário encontrado." />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseHref="/documentarios"
        />
      </div>
    </main>
  );
}
