/**
 * TMDB API client — server-side only.
 * A chave TMDB_API_KEY nunca é exposta ao cliente.
 * Quando USE_MOCK=true, todos os métodos retornam dados do mock.
 */
import {
  mockDetails,
  mockDiscover,
  mockProviders,
  mockSearch,
  mockTrending,
} from "./mock-data";
import type {
  DiscoverResult,
  MediaDetails,
  MediaItem,
  MediaType,
  PaginatedResult,
  SearchResult,
  TrendingResult,
  WatchProvidersByType,
} from "./types";

const USE_MOCK = process.env.USE_MOCK === "true";
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

/** Constrói URL de imagem TMDB ou devolve URL completa de mock (picsum) */
export function getImageUrl(
  path: string | null | undefined,
  size: "w200" | "w300" | "w500" | "w780" | "original" = "w500",
): string | null {
  if (!path) return null;
  if (path.startsWith("https://") || path.startsWith("http://")) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

// ---------------------------------------------------------------------------
// Mapeadores: resposta TMDB → nossos tipos
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapItem(raw: any): MediaItem {
  const isMovie = raw.media_type === "movie" || raw.title !== undefined;
  return {
    id: raw.id,
    mediaType: isMovie ? "movie" : "tv",
    title: raw.title ?? raw.name ?? "",
    overview: raw.overview ?? "",
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    voteAverage: raw.vote_average ?? 0,
    voteCount: raw.vote_count ?? 0,
    releaseDate: raw.release_date ?? raw.first_air_date ?? "",
    genreIds: raw.genre_ids ?? [],
    popularity: raw.popularity ?? 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDetails(raw: any, type: MediaType): MediaDetails {
  return {
    ...mapItem({ ...raw, media_type: type }),
    tagline: raw.tagline ?? "",
    status: raw.status ?? "",
    genres: raw.genres ?? [],
    runtime: raw.runtime,
    revenue: raw.revenue,
    budget: raw.budget,
    numberOfSeasons: raw.number_of_seasons,
    numberOfEpisodes: raw.number_of_episodes,
    cast: (raw.credits?.cast ?? []).slice(0, 20).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (c: any) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profilePath: c.profile_path ?? null,
        order: c.order,
      }),
    ),
    videos: (raw.videos?.results ?? [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((v: any) => v.site === "YouTube")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((v: any) => ({
        id: v.id,
        key: v.key,
        name: v.name,
        site: v.site,
        type: v.type,
        official: v.official,
      })),
    similar: (raw.similar?.results ?? []).slice(0, 8).map(mapItem),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProviders(raw: any): WatchProvidersByType | null {
  const br = raw?.results?.BR;
  if (!br) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapProvider = (p: any) => ({
    logoPath: p.logo_path,
    providerId: p.provider_id,
    providerName: p.provider_name,
    displayPriority: p.display_priority,
  });
  return {
    link: br.link,
    flatrate: br.flatrate?.map(mapProvider),
    rent: br.rent?.map(mapProvider),
    buy: br.buy?.map(mapProvider),
  };
}

// ---------------------------------------------------------------------------
// Fetch helper (somente servidor)
// ---------------------------------------------------------------------------
// Suporta autenticação v3 (api_key query param) e v4 (Bearer JWT).
// O token JWT começa com "eyJ"; a chave v3 é uma string hex curta.
const IS_BEARER = TMDB_API_KEY?.startsWith("eyJ");

async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string> = {},
  revalidate = 3600,
): Promise<T> {
  if (!TMDB_API_KEY) {
    throw new Error(
      "TMDB_API_KEY não configurada. Configure em .env.local ou nas variáveis de ambiente.",
    );
  }
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  if (!IS_BEARER) {
    url.searchParams.set("api_key", TMDB_API_KEY);
  }
  url.searchParams.set("language", "pt-BR");
  for (const [key, val] of Object.entries(params)) {
    url.searchParams.set(key, val);
  }
  const headers: Record<string, string> = {};
  if (IS_BEARER) {
    headers["Authorization"] = `Bearer ${TMDB_API_KEY}`;
  }
  const res = await fetch(url.toString(), {
    headers,
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`TMDB API ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// API pública
// ---------------------------------------------------------------------------

export async function getTrending(
  type: "all" | "movie" | "tv" = "all",
  page = 1,
): Promise<TrendingResult> {
  if (USE_MOCK) return mockTrending(type, page);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = await tmdbFetch<any>(`/trending/${type}/week`, {
    page: String(page),
  });
  return {
    page: raw.page,
    results: raw.results.map(mapItem),
    totalResults: raw.total_results,
    totalPages: raw.total_pages,
  };
}

export async function searchMedia(
  query: string,
  page = 1,
): Promise<SearchResult> {
  if (USE_MOCK) return mockSearch(query, page);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = await tmdbFetch<any>("/search/multi", {
    query,
    page: String(page),
    include_adult: "false",
  });
  return {
    page: raw.page,
    results: raw.results
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((r: any) => r.media_type === "movie" || r.media_type === "tv")
      .map(mapItem),
    totalResults: raw.total_results,
    totalPages: raw.total_pages,
  };
}

export async function getDetails(
  type: MediaType,
  id: number,
): Promise<MediaDetails | null> {
  if (USE_MOCK) return mockDetails(type, id);

  const endpoint = type === "movie" ? `/movie/${id}` : `/tv/${id}`;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await tmdbFetch<any>(endpoint, {
      append_to_response: "credits,videos,similar",
    });
    return mapDetails(raw, type);
  } catch {
    return null;
  }
}

export async function getWatchProviders(
  type: MediaType,
  id: number,
): Promise<WatchProvidersByType | null> {
  if (USE_MOCK) return mockProviders(type, id);

  const endpoint =
    type === "movie"
      ? `/movie/${id}/watch/providers`
      : `/tv/${id}/watch/providers`;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await tmdbFetch<any>(endpoint, {});
    return mapProviders(raw);
  } catch {
    return null;
  }
}

export async function getExternalIds(
  type: MediaType,
  id: number,
): Promise<{ imdbId: string | null }> {
  if (USE_MOCK) return { imdbId: null };
  const endpoint =
    type === "movie" ? `/movie/${id}/external_ids` : `/tv/${id}/external_ids`;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = await tmdbFetch<any>(endpoint, {});
    return { imdbId: raw.imdb_id ?? null };
  } catch {
    return { imdbId: null };
  }
}

export async function discoverMedia(
  type: MediaType,
  genreId: number | null,
  page = 1,
): Promise<DiscoverResult> {
  if (USE_MOCK) return mockDiscover(type, genreId, page);

  const endpoint = type === "movie" ? "/discover/movie" : "/discover/tv";
  const params: Record<string, string> = {
    sort_by: "popularity.desc",
    page: String(page),
    "vote_count.gte": "100",
    watch_region: "BR",
    with_watch_monetization_types: "flatrate",
  };
  if (genreId !== null) params.with_genres = String(genreId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = await tmdbFetch<any>(endpoint, params);
  return {
    page: raw.page,
    results: raw.results.map((r: MediaItem) =>
      mapItem({ ...r, media_type: type }),
    ),
    totalResults: raw.total_results,
    totalPages: raw.total_pages,
  };
}

export type {
  DiscoverResult,
  MediaDetails,
  MediaItem,
  MediaType,
  PaginatedResult,
  SearchResult,
  TrendingResult,
  WatchProvidersByType,
};
