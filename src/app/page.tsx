import Hero from "@/components/Hero";
import Carousel from "@/components/Carousel";
import { getTrending, discoverMedia, getNowPlayingIds } from "@/lib/tmdb";

// Renderizado no servidor a cada requisição — evita falha de build
// se as variáveis de ambiente não estiverem disponíveis no momento da pré-renderização
export const dynamic = "force-dynamic";

export default async function Home() {
  const [movies, tv, docs, nowPlayingIds] = await Promise.all([
    getTrending("movie"),
    getTrending("tv"),
    discoverMedia("tv", 99),
    getNowPlayingIds(),
  ]);

  const moviesWithTheaters = {
    ...movies,
    results: movies.results.map((item) => ({
      ...item,
      inTheaters: nowPlayingIds.has(item.id),
    })),
  };

  const heroItem = moviesWithTheaters.results[0] ?? tv.results[0];

  return (
    <main className="flex flex-col flex-1">
      {heroItem && <Hero item={heroItem} />}

      <div className="bg-black flex flex-col gap-2 pb-12 -mt-16 relative z-10">
        <Carousel
          title="Filmes em Alta"
          items={moviesWithTheaters.results}
          viewAllHref="/filmes"
        />
        <Carousel
          title="Séries em Alta"
          items={tv.results}
          viewAllHref="/series"
        />
        <Carousel
          title="Documentários"
          items={docs.results}
          viewAllHref="/documentarios"
        />
      </div>
    </main>
  );
}
