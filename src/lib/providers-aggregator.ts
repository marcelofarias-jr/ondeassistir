/**
 * Agregador de providers de streaming.
 *
 * Estratégia de cruzamento:
 *   1. TMDB/JustWatch — sempre chamado, dados do Brasil via JustWatch, logos confiáveis
 *   2. Watchmode      — chamado se WATCHMODE_API_KEY estiver configurada (2.500 req/mês free)
 *   3. Streaming Avail — chamado se STREAMING_AVAIL_API_KEY estiver configurada (100 req/dia free)
 *      └─ precisa do IMDB ID, obtido via TMDB /external_ids
 *
 * Merge: providers da mesma plataforma (mesmo nome normalizado) são fundidos em um único
 * objeto, acumulando links diretos, badges de qualidade e confirmações de múltiplas fontes.
 * Providers exclusivos de uma fonte são simplesmente adicionados.
 */

import { getWatchProviders, getExternalIds } from "./tmdb";
import { getWatchmodeProviders } from "./watchmode";
import { getStreamingAvailability } from "./streaming-avail";
import type { MediaType, WatchProvider, WatchProvidersByType } from "./types";

// ─── Normalização para deduplicação ──────────────────────────────────────────

/**
 * Chave canônica de um provider para fins de deduplicação.
 * Ex.: "Amazon Prime Video" → "amazonprime", "Disney+" → "disney"
 */
function normalizeKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "")
    .replace(/primevideo$/, "prime")
    .replace(/^amazon/, "amazon")
    .replace(/hbomax/, "max")
    .replace(/appletvplus/, "apple")
    .replace(/appletv\+/, "apple")
    .replace(/disneyplus/, "disney")
    .replace(/paramountplus/, "paramount");
}

type SourceName = "tmdb" | "watchmode" | "streaming-avail";

// ─── Merge de uma categoria (flatrate / rent / buy / free) ────────────────────

function mergeCategory(
  lists: Array<{ items: WatchProvider[] | undefined; source: SourceName }>,
): WatchProvider[] | undefined {
  const map = new Map<
    string,
    WatchProvider & { _confirmedBy: Set<SourceName> }
  >();

  for (const { items, source } of lists) {
    if (!items?.length) continue;
    for (const p of items) {
      const key = normalizeKey(p.providerName);
      const existing = map.get(key);
      if (existing) {
        existing._confirmedBy.add(source);
        // Prefere logo TMDB (caminho relativo) sobre URLs externas
        if (!existing.logoPath && p.logoPath) existing.logoPath = p.logoPath;
        // Mantém link direto mais específico
        if (!existing.watchLink && p.watchLink)
          existing.watchLink = p.watchLink;
        // Qualidade: prefere maior
        if (!existing.quality && p.quality) existing.quality = p.quality;
        // Preço: mantém o primeiro que tiver
        if (existing.price === undefined && p.price !== undefined) {
          existing.price = p.price;
        }
        // displayPriority: menor = mais relevante
        if (p.displayPriority < existing.displayPriority) {
          existing.displayPriority = p.displayPriority;
        }
      } else {
        map.set(key, {
          ...p,
          _confirmedBy: new Set([source]),
        });
      }
    }
  }

  if (!map.size) return undefined;

  return Array.from(map.values())
    .map(({ _confirmedBy, ...p }) => ({
      ...p,
      confirmedBy: Array.from(_confirmedBy),
    }))
    .sort((a, b) => a.displayPriority - b.displayPriority);
}

// ─── API pública ──────────────────────────────────────────────────────────────

export async function getAggregatedProviders(
  type: MediaType,
  id: number,
): Promise<WatchProvidersByType | null> {
  const hasWatchmode = !!process.env.WATCHMODE_API_KEY;
  const hasStreamingAvail = !!process.env.STREAMING_AVAIL_API_KEY;

  /**
   * Executa em paralelo:
   *  - TMDB providers (sempre)
   *  - Watchmode providers (se chave configurada)
   *  - IMDB ID lookup → Streaming Availability (se chave configurada)
   *    O encadeamento .then() permite que o fetch do IMDB ID e do Streaming Avail
   *    aconteçam concorrentemente com TMDB + Watchmode.
   */
  const [tmdbResult, watchmodeResult, streamingAvailResult] =
    await Promise.allSettled([
      getWatchProviders(type, id),

      hasWatchmode ? getWatchmodeProviders(type, id) : Promise.resolve(null),

      hasStreamingAvail
        ? getExternalIds(type, id).then(({ imdbId }) =>
            imdbId ? getStreamingAvailability(imdbId) : null,
          )
        : Promise.resolve(null),
    ]);

  const tmdb = tmdbResult.status === "fulfilled" ? tmdbResult.value : null;
  const watchmode =
    watchmodeResult.status === "fulfilled" ? watchmodeResult.value : null;
  const streamingAvail =
    streamingAvailResult.status === "fulfilled"
      ? streamingAvailResult.value
      : null;

  if (!tmdb && !watchmode && !streamingAvail) return null;

  const lists = (
    items: WatchProvider[] | undefined,
    wmItems: WatchProvider[] | undefined,
    saItems: WatchProvider[] | undefined,
  ) => [
    { items, source: "tmdb" as SourceName },
    { items: wmItems, source: "watchmode" as SourceName },
    { items: saItems, source: "streaming-avail" as SourceName },
  ];

  return {
    // Link preferencial: JustWatch/TMDB → Streaming Avail
    link: tmdb?.link ?? streamingAvail?.link,

    flatrate: mergeCategory(
      lists(tmdb?.flatrate, watchmode?.flatrate, streamingAvail?.flatrate),
    ),
    rent: mergeCategory(
      lists(tmdb?.rent, watchmode?.rent, streamingAvail?.rent),
    ),
    buy: mergeCategory(lists(tmdb?.buy, watchmode?.buy, streamingAvail?.buy)),
    // "free" vem apenas de Watchmode e Streaming Avail (TMDB não tem esta categoria)
    free: mergeCategory([
      { items: watchmode?.free, source: "watchmode" },
      { items: streamingAvail?.free, source: "streaming-avail" },
    ]),
  };
}
