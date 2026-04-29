export type MediaType = "movie" | "tv";

export interface Genre {
  id: number;
  name: string;
}

export interface MediaItem {
  id: number;
  mediaType: MediaType;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  voteAverage: number;
  voteCount: number;
  releaseDate: string;
  genreIds: number[];
  popularity: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
  order: number;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface WatchProvider {
  logoPath: string | null;
  providerId: number;
  providerName: string;
  displayPriority: number;
  /** Link direto para assistir (vindo do Watchmode ou Streaming Availability) */
  watchLink?: string;
  /** Qualidade do stream: "4K" | "HD" | "SD" */
  quality?: string;
  /** Preço para aluguel/compra (em BRL ou USD) */
  price?: number;
  /** Quais APIs confirmaram este provider */
  confirmedBy?: string[];
}

export interface WatchProvidersByType {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  /** Disponível gratuitamente com anúncios */
  free?: WatchProvider[];
}

export interface MediaDetails extends MediaItem {
  tagline: string;
  status: string;
  genres: Genre[];
  // Movie specific
  runtime?: number;
  revenue?: number;
  budget?: number;
  // TV specific
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  // Relations
  cast: CastMember[];
  videos: Video[];
  similar: MediaItem[];
}

export interface PaginatedResult<T> {
  page: number;
  results: T[];
  totalResults: number;
  totalPages: number;
}

export type TrendingResult = PaginatedResult<MediaItem>;
export type SearchResult = PaginatedResult<MediaItem>;
export type DiscoverResult = PaginatedResult<MediaItem>;
