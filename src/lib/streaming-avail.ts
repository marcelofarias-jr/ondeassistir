/**
 * Streaming Availability API client (via RapidAPI) — server-side only.
 * Documentação: https://docs.movieofthenight.com/
 *
 * Requer IMDB ID (obtido via TMDB /external_ids).
 * Plano gratuito: 100 req/dia.
 *
 * Use a variável STREAMING_AVAIL_API_KEY com a chave RapidAPI.
 */

import type { WatchProvider, WatchProvidersByType } from "./types";

const STREAMING_AVAIL_KEY = process.env.STREAMING_AVAIL_API_KEY;
const RAPIDAPI_HOST = "streaming-availability.p.rapidapi.com";
const STREAMING_AVAIL_BASE = `https://${RAPIDAPI_HOST}`;

/**
 * Mapa de service.id do Streaming Availability → provider_id TMDB.
 * Permite reutilizar logos do TMDB quando o Streaming Avail não tiver imagem.
 */
const SERVICE_TO_TMDB_ID: Record<string, number> = {
  netflix: 8,
  prime: 119,
  disney: 337,
  hbo: 384,
  max: 384,
  apple: 350,
  paramount: 531,
  globoplay: 307,
  star: 619,
  peacock: 386,
  crunchyroll: 283,
  mubi: 11,
  pluto: 300, // Pluto TV
  tubi: 613,
};

// ─── Tipos internos (v4 da API) ────────────────────────────────────────────────

interface StreamingService {
  id: string;
  name: string;
  homePage: string;
  imageSet?: {
    /** Logo para fundo escuro (tema dark) */
    darkThemeImage?: string;
    lightThemeImage?: string;
    whiteImage?: string;
  };
}

interface StreamingOption {
  service: StreamingService;
  /** subscription | rent | buy | free | addon */
  type: "subscription" | "rent" | "buy" | "free" | "addon";
  link: string;
  /** "hd" | "4k" | "sd" */
  quality: string;
  price?: {
    amount: string;
    currency: string;
    formatted: string;
  } | null;
  expiresSoon?: boolean;
}

interface StreamingAvailResponse {
  streamingOptions?: {
    br?: StreamingOption[];
  };
}

// ─── API pública ──────────────────────────────────────────────────────────────

export async function getStreamingAvailability(
  imdbId: string,
): Promise<WatchProvidersByType | null> {
  if (!STREAMING_AVAIL_KEY) return null;

  try {
    const url = `${STREAMING_AVAIL_BASE}/shows/${encodeURIComponent(imdbId)}?country=br&series_granularity=show&output_language=original`;

    const res = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": STREAMING_AVAIL_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
      },
      next: { revalidate: 3600 },
    });

    if (res.status === 404) return null;
    if (!res.ok) {
      throw new Error(
        `Streaming Availability API ${res.status}: ${await res.text()}`,
      );
    }

    const data = (await res.json()) as StreamingAvailResponse;
    const options = data.streamingOptions?.br ?? [];
    if (!options.length) return null;

    const flatrate: WatchProvider[] = [];
    const rent: WatchProvider[] = [];
    const buy: WatchProvider[] = [];
    const free: WatchProvider[] = [];

    // Dedup dentro do mesmo serviço+tipo (evita duplicatas da API)
    const seen = new Set<string>();

    options.forEach((opt, i) => {
      const key = `${opt.service.id}-${opt.type}`;
      if (seen.has(key)) return;
      seen.add(key);

      // Prefere logo para tema escuro
      const logoUrl =
        opt.service.imageSet?.darkThemeImage ??
        opt.service.imageSet?.lightThemeImage ??
        null;

      const provider: WatchProvider = {
        logoPath: logoUrl,
        providerId: SERVICE_TO_TMDB_ID[opt.service.id] ?? i + 9000,
        providerName: opt.service.name,
        displayPriority: i,
        watchLink: opt.link || undefined,
        quality: opt.quality ? opt.quality.toUpperCase() : undefined,
        price: opt.price ? parseFloat(opt.price.amount) : undefined,
      };

      if (opt.type === "subscription") flatrate.push(provider);
      else if (opt.type === "rent") rent.push(provider);
      else if (opt.type === "buy") buy.push(provider);
      else if (opt.type === "free") free.push(provider);
      // "addon" ignorado (canais dentro de plataformas)
    });

    return {
      flatrate: flatrate.length ? flatrate : undefined,
      rent: rent.length ? rent : undefined,
      buy: buy.length ? buy : undefined,
      free: free.length ? free : undefined,
    };
  } catch (err) {
    console.warn("[streaming-avail] falha ao buscar providers:", err);
    return null;
  }
}
