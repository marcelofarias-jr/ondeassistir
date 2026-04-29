/**
 * Watchmode API client — server-side only.
 * Documentação: https://api.watchmode.com/docs/
 *
 * Aceita IDs do TMDB diretamente (search_field=tmdb_movie_id ou tmdb_tv_id).
 * Plano gratuito: 2.500 req/mês.
 *
 * Fluxo:
 *  1. GET /v1/search/?search_field=tmdb_*_id&search_value={tmdbId} → Watchmode title ID
 *  2. GET /v1/title/{watchmodeId}/sources/?regions=BR → lista de serviços de streaming
 */

import type { MediaType, WatchProvider, WatchProvidersByType } from "./types";

const WATCHMODE_API_KEY = process.env.WATCHMODE_API_KEY;
const WATCHMODE_BASE = "https://api.watchmode.com/v1";

/**
 * Mapa de source_id do Watchmode → provider_id do TMDB/JustWatch.
 * Usado para mesclar logos TMDB quando o Watchmode não tiver logo 100px.
 */
const WATCHMODE_TO_TMDB_PROVIDER_ID: Record<number, number> = {
  203: 8, // Netflix
  26: 119, // Amazon Prime Video
  372: 337, // Disney+
  387: 384, // Max (HBO Max)
  371: 350, // Apple TV+
  444: 531, // Paramount+
  157: 307, // Globoplay (mapeamento aproximado)
  9: 619, // Star+
  3: 283, // Crunchyroll
};

// ─── Tipos internos ──────────────────────────────────────────────────────────

interface WatchmodeSearchResult {
  title_results: Array<{
    id: number;
    name: string;
    type: string;
    tmdb_id: number;
  }>;
}

interface WatchmodeSource {
  source_id: number;
  name: string;
  /** sub = assinatura, rent = aluguel, buy = compra, free = grátis, free-with-ads = AVOD */
  type: "sub" | "rent" | "buy" | "free" | "tve" | "free-with-ads";
  region: string;
  web_url: string;
  /** Formato de qualidade: "HD", "4K", "SD" */
  format: string;
  price: number | null;
  logo_100px: string;
}

// ─── Fetch helper ─────────────────────────────────────────────────────────────

async function watchmodeFetch<T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<T> {
  if (!WATCHMODE_API_KEY) {
    throw new Error("WATCHMODE_API_KEY não configurada.");
  }
  const url = new URL(`${WATCHMODE_BASE}${endpoint}`);
  url.searchParams.set("apiKey", WATCHMODE_API_KEY);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Watchmode ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

// ─── API pública ──────────────────────────────────────────────────────────────

export async function getWatchmodeProviders(
  type: MediaType,
  tmdbId: number,
): Promise<WatchProvidersByType | null> {
  if (!WATCHMODE_API_KEY) return null;

  try {
    // Passo 1: resolver TMDB ID → Watchmode title ID
    const searchField = type === "movie" ? "tmdb_movie_id" : "tmdb_tv_id";

    const searchResult = await watchmodeFetch<WatchmodeSearchResult>(
      "/search/",
      { search_field: searchField, search_value: String(tmdbId) },
    );

    const firstResult = searchResult.title_results?.[0];
    if (!firstResult) return null;

    // Passo 2: buscar fontes (streaming) disponíveis no Brasil
    const sources = await watchmodeFetch<WatchmodeSource[]>(
      `/title/${firstResult.id}/sources/`,
      { regions: "BR" },
    );

    if (!sources.length) return null;

    const flatrate: WatchProvider[] = [];
    const rent: WatchProvider[] = [];
    const buy: WatchProvider[] = [];
    const free: WatchProvider[] = [];

    sources.forEach((s, i) => {
      const provider: WatchProvider = {
        // logo_100px é uma URL completa — getImageUrl já lida com isso
        logoPath: s.logo_100px || null,
        providerId: WATCHMODE_TO_TMDB_PROVIDER_ID[s.source_id] ?? s.source_id,
        providerName: s.name,
        displayPriority: i,
        watchLink: s.web_url || undefined,
        quality: s.format ? s.format.toUpperCase() : undefined,
        price: s.price ?? undefined,
      };

      if (s.type === "sub") flatrate.push(provider);
      else if (s.type === "rent") rent.push(provider);
      else if (s.type === "buy") buy.push(provider);
      else if (s.type === "free" || s.type === "free-with-ads")
        free.push(provider);
      // "tve" (TV Everywhere / operadora) ignorado
    });

    return {
      flatrate: flatrate.length ? flatrate : undefined,
      rent: rent.length ? rent : undefined,
      buy: buy.length ? buy : undefined,
      free: free.length ? free : undefined,
    };
  } catch (err) {
    // Falha silenciosa — o agregador usa os outros sources
    console.warn("[watchmode] falha ao buscar providers:", err);
    return null;
  }
}
