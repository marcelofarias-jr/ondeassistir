import Hero from "@/components/Hero";
import Carousel from "@/components/Carousel";
import { getTrending, discoverMedia, getNowPlayingIds } from "@/lib/tmdb";

// Renderizado no servidor a cada requisição — evita falha de build
// se as variáveis de ambiente não estiverem disponíveis no momento da pré-renderização
export const dynamic = "force-dynamic";

export default async function Home() {
  let movies = null;
  let tv = null;
  let docs = null;
  let nowPlayingIds = new Set<number>();
  let error = null;
  try {
    [movies, tv, docs, nowPlayingIds] = await Promise.all([
      getTrending("movie"),
      getTrending("tv"),
      discoverMedia("tv", 99),
      getNowPlayingIds(),
    ]);
  } catch (e) {
    console.error("[SSR][Home] Erro ao carregar dados:", e);
    error = "Erro ao carregar dados. Tente novamente mais tarde.";
  }

  // Fallbacks para garantir renderização
  const moviesWithTheaters =
    movies && movies.results
      ? {
          ...movies,
          results: movies.results.map((item) => ({
            ...item,
            inTheaters: nowPlayingIds.has(item.id),
          })),
        }
      : { results: [] };

  const heroItem =
    moviesWithTheaters.results[0] ?? (tv && tv.results ? tv.results[0] : null);

  return (
    <main className="flex flex-col flex-1">
      {error && (
        <div className="bg-red-600 text-white text-center py-4 font-semibold">
          {error}
        </div>
      )}
      {heroItem && <Hero item={heroItem} />}

      <div className="bg-black flex flex-col gap-2 pb-12 -mt-16 relative z-10">
        <Carousel
          title="Filmes em Alta"
          items={moviesWithTheaters.results}
          viewAllHref="/filmes"
        />
        <Carousel
          title="Séries em Alta"
          items={tv && tv.results ? tv.results : []}
          viewAllHref="/series"
        />
        <Carousel
          title="Documentários"
          items={docs && docs.results ? docs.results : []}
          viewAllHref="/documentarios"
        />
      </div>
    </main>
  );
}
