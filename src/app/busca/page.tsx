import type { Metadata } from "next";
import MediaGrid from "@/components/MediaGrid";
import SearchInput from "@/components/SearchInput";
import { searchMedia } from "@/lib/tmdb";

export const metadata: Metadata = {
  title: "Busca — OndeAssistir",
};

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  const data = query ? await searchMedia(query) : null;

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <SearchInput defaultValue={query} />
        </div>

        {query && data ? (
          <>
            <p className="text-zinc-500 text-sm mb-6">
              {data.totalResults} resultado{data.totalResults !== 1 ? "s" : ""}{" "}
              para{" "}
              <span className="text-white font-semibold">
                &ldquo;{query}&rdquo;
              </span>
            </p>
            <MediaGrid
              items={data.results}
              emptyMessage={`Nenhum resultado para "${query}".`}
            />
          </>
        ) : (
          !query && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-zinc-500 text-lg">
                Digite o nome de um filme, série ou documentário para buscar.
              </p>
            </div>
          )
        )}
      </div>
    </main>
  );
}
