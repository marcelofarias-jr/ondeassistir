import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, Clock, Tv, Film } from "lucide-react";
import { getDetails, getImageUrl, getNowPlayingIds } from "@/lib/tmdb";
import { getAggregatedProviders } from "@/lib/providers-aggregator";
import { formatYear, formatRuntime, mediaTypeLabel } from "@/lib/utils";
import type { MediaType } from "@/lib/types";
import { notFound } from "next/navigation";
import WatchProviders from "@/components/WatchProviders";
import TrailerEmbed from "@/components/TrailerEmbed";
import CastSection from "@/components/CastSection";
import SimilarContent from "@/components/SimilarContent";

interface Props {
  params: Promise<{ type: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, id } = await params;
  const details = await getDetails(type as MediaType, parseInt(id, 10));
  if (!details) return { title: "Não encontrado — OndeAssistir" };
  return {
    title: `${details.title} — OndeAssistir`,
    description: details.overview,
  };
}

export default async function DetailPage({ params }: Props) {
  let type, id;
  try {
    ({ type, id } = await params);
  } catch {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 font-semibold">
          Erro ao carregar parâmetros da URL.
        </div>
      </main>
    );
  }

  if (type !== "movie" && type !== "tv") notFound();

  const mediaType = type as MediaType;
  const numId = parseInt(id, 10);

  let details = null;
  let providers = null;
  let nowPlayingIds = new Set<number>();
  let error = null;
  try {
    [details, providers, nowPlayingIds] = await Promise.all([
      getDetails(mediaType, numId),
      getAggregatedProviders(mediaType, numId),
      mediaType === "movie"
        ? getNowPlayingIds()
        : Promise.resolve(new Set<number>()),
    ]);
  } catch {
    error = "Erro ao carregar dados. Tente novamente mais tarde.";
  }

  if (!details) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 font-semibold">
          {error || "Conteúdo não encontrado."}
        </div>
      </main>
    );
  }

  const isInTheaters = mediaType === "movie" && nowPlayingIds.has(numId);

  const backdrop = getImageUrl(details.backdropPath, "original");
  const poster = getImageUrl(details.posterPath, "w500");
  const year = formatYear(details.releaseDate);

  return (
    <main className="min-h-screen pt-16">
      {error && (
        <div className="bg-red-600 text-white text-center py-4 font-semibold">
          {error}
        </div>
      )}
      {/* Backdrop */}
      {backdrop && (
        <div className="relative h-[50vh] min-h-75">
          <Image
            src={backdrop}
            alt={details.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent" />
        </div>
      )}

      <div className="px-4 md:px-8 pb-20 max-w-7xl mx-auto animate-fade-in">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm mt-6 mb-8"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          {poster && (
            <div className="relative w-48 md:w-64 aspect-2/3 rounded-xl overflow-hidden bg-zinc-900 shrink-0 self-start -mt-32 md:-mt-48 shadow-2xl border border-zinc-800">
              <Image
                src={poster}
                alt={details.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 192px, 256px"
              />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 mt-0 md:mt-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400 mb-2">
              <span className="text-[#e50914] font-semibold">
                {mediaTypeLabel(details.mediaType)}
              </span>
              {year && (
                <>
                  <span className="text-zinc-700">·</span>
                  <span>{year}</span>
                </>
              )}
              {details.runtime && (
                <>
                  <span className="text-zinc-700">·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {formatRuntime(details.runtime)}
                  </span>
                </>
              )}
              {details.numberOfSeasons && (
                <>
                  <span className="text-zinc-700">·</span>
                  <span className="flex items-center gap-1">
                    <Tv size={13} />
                    {details.numberOfSeasons} temporada
                    {details.numberOfSeasons !== 1 ? "s" : ""}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">
              {details.title}
            </h1>

            {isInTheaters && (
              <div className="inline-flex items-center gap-2 bg-green-600/20 border border-green-500/40 text-green-400 rounded-full px-4 py-1.5 text-sm font-semibold mb-3">
                <Film size={14} />
                Em Cartaz nos Cinemas
              </div>
            )}

            {details.tagline && (
              <p className="text-zinc-500 italic mb-4">{details.tagline}</p>
            )}

            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center gap-1.5 text-yellow-400 font-bold text-lg">
                <Star size={18} fill="currentColor" />
                {details.voteAverage.toFixed(1)}
              </span>
              <span className="text-zinc-600 text-sm">
                ({details.voteCount.toLocaleString("pt-BR")} votos)
              </span>
            </div>

            {details.genres && details.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {details.genres.map((g) => (
                  <span
                    key={g.id}
                    className="text-xs border border-zinc-700 text-zinc-400 rounded-full px-3 py-1"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-zinc-300 leading-relaxed text-base max-w-2xl mb-8">
              {details.overview}
            </p>

            {/* Onde Assistir */}
            <WatchProviders
              providers={providers ?? {}}
              tmdbLink={providers?.link}
            />
          </div>
        </div>

        {/* Trailer */}
        {details.videos.length > 0 && (
          <section className="mt-14 max-w-3xl">
            <TrailerEmbed videos={details.videos} title={details.title} />
          </section>
        )}

        {/* Elenco */}
        {details.cast.length > 0 && (
          <section className="mt-14">
            <CastSection cast={details.cast} />
          </section>
        )}

        {/* Semelhantes */}
        {details.similar.length > 0 && (
          <section className="mt-14">
            <SimilarContent items={details.similar} mediaType={type} />
          </section>
        )}
      </div>
    </main>
  );
}
