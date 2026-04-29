import type {
  CastMember,
  DiscoverResult,
  MediaDetails,
  MediaItem,
  MediaType,
  PaginatedResult,
  SearchResult,
  TrendingResult,
  Video,
  WatchProvider,
  WatchProvidersByType,
} from "./types";

// ---------------------------------------------------------------------------
// Helpers para gerar URLs de imagens fake (picsum seed = seed consistente)
// ---------------------------------------------------------------------------
const poster = (seed: string) =>
  `https://picsum.photos/seed/${seed}/300/450`;
const backdrop = (seed: string) =>
  `https://picsum.photos/seed/${seed}bg/1280/720`;
const profile = (seed: string) =>
  `https://picsum.photos/seed/${seed}p/200/300`;
const logo = (seed: string) =>
  `https://picsum.photos/seed/${seed}logo/100/100`;

// ---------------------------------------------------------------------------
// Providers conhecidos no Brasil
// ---------------------------------------------------------------------------
const PROVIDERS: Record<string, WatchProvider> = {
  netflix: {
    providerId: 8,
    providerName: "Netflix",
    logoPath: logo("netflix"),
    displayPriority: 1,
  },
  prime: {
    providerId: 119,
    providerName: "Amazon Prime Video",
    logoPath: logo("prime"),
    displayPriority: 2,
  },
  disney: {
    providerId: 337,
    providerName: "Disney+",
    logoPath: logo("disney"),
    displayPriority: 3,
  },
  hbo: {
    providerId: 384,
    providerName: "Max",
    logoPath: logo("hbo"),
    displayPriority: 4,
  },
  globo: {
    providerId: 307,
    providerName: "Globoplay",
    logoPath: logo("globo"),
    displayPriority: 5,
  },
  apple: {
    providerId: 350,
    providerName: "Apple TV+",
    logoPath: logo("apple"),
    displayPriority: 6,
  },
  paramount: {
    providerId: 531,
    providerName: "Paramount+",
    logoPath: logo("paramount"),
    displayPriority: 7,
  },
};

// ---------------------------------------------------------------------------
// Cast e vídeos genéricos para mock
// ---------------------------------------------------------------------------
function makeCast(names: string[]): CastMember[] {
  return names.map((name, i) => ({
    id: 9000 + i,
    name,
    character: `Personagem ${i + 1}`,
    profilePath: profile(`cast${i}`),
    order: i,
  }));
}

function makeTrailer(youtubeKey: string, title: string): Video {
  return {
    id: `vid-${youtubeKey}`,
    key: youtubeKey,
    name: `${title} — Trailer Oficial`,
    site: "YouTube",
    type: "Trailer",
    official: true,
  };
}

// ---------------------------------------------------------------------------
// FILMES
// ---------------------------------------------------------------------------
const MOCK_MOVIES: MediaItem[] = [
  {
    id: 101,
    mediaType: "movie",
    title: "Interestelar",
    overview:
      "Uma equipe de exploradores viaja através de um buraco de minhoca recém-descoberto para superar as limitações das viagens espaciais humanas e conquistar as vastas distâncias envolvidas numa viagem interestelar.",
    posterPath: poster("interstellar"),
    backdropPath: backdrop("interstellar"),
    voteAverage: 8.6,
    voteCount: 33000,
    releaseDate: "2014-11-07",
    genreIds: [18, 878, 12],
    popularity: 120.5,
  },
  {
    id: 102,
    mediaType: "movie",
    title: "O Poderoso Chefão",
    overview:
      "A envelhecida patriarca de uma dinastia do crime organizado transfere o controle de seu império clandestino para seu filho relutante.",
    posterPath: poster("godfather"),
    backdropPath: backdrop("godfather"),
    voteAverage: 9.2,
    voteCount: 18000,
    releaseDate: "1972-03-24",
    genreIds: [18, 80],
    popularity: 98.3,
  },
  {
    id: 103,
    mediaType: "movie",
    title: "Clube da Luta",
    overview:
      "Um insone que trabalha como analista de recall forma um estranho clube de luta com um vendedor de sabão e fica envolto em uma perigosa conspiração.",
    posterPath: poster("fightclub"),
    backdropPath: backdrop("fightclub"),
    voteAverage: 8.8,
    voteCount: 27000,
    releaseDate: "1999-10-15",
    genreIds: [18, 53],
    popularity: 87.1,
  },
  {
    id: 104,
    mediaType: "movie",
    title: "Parasita",
    overview:
      "A família Kims, muito pobre, entra na vida da família Park, muito rica. À medida que as relações ficam entrelaçadas, dois mundos colidem de forma surpreendente.",
    posterPath: poster("parasite"),
    backdropPath: backdrop("parasite"),
    voteAverage: 8.5,
    voteCount: 16000,
    releaseDate: "2019-05-30",
    genreIds: [35, 18, 53],
    popularity: 75.9,
  },
  {
    id: 105,
    mediaType: "movie",
    title: "Oppenheimer",
    overview:
      "A história do físico americano J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica durante a Segunda Guerra Mundial.",
    posterPath: poster("oppenheimer"),
    backdropPath: backdrop("oppenheimer"),
    voteAverage: 8.1,
    voteCount: 20000,
    releaseDate: "2023-07-21",
    genreIds: [18, 36],
    popularity: 145.2,
  },
  {
    id: 106,
    mediaType: "movie",
    title: "A Lista de Schindler",
    overview:
      "Em busca de dinheiro, um industrial alemão se torna o salvador improvável de mais de mil judeus poloneses durante o Holocausto.",
    posterPath: poster("schindler"),
    backdropPath: backdrop("schindler"),
    voteAverage: 8.9,
    voteCount: 14000,
    releaseDate: "1993-12-15",
    genreIds: [18, 36, 10752],
    popularity: 65.7,
  },
];

// ---------------------------------------------------------------------------
// SÉRIES
// ---------------------------------------------------------------------------
const MOCK_TV: MediaItem[] = [
  {
    id: 201,
    mediaType: "tv",
    title: "Breaking Bad",
    overview:
      "Um professor de química do ensino médio diagnosticado com câncer se torna fabricante e traficante de metanfetamina para garantir o futuro financeiro de sua família.",
    posterPath: poster("breakingbad"),
    backdropPath: backdrop("breakingbad"),
    voteAverage: 9.5,
    voteCount: 12000,
    releaseDate: "2008-01-20",
    genreIds: [18, 80],
    popularity: 320.4,
  },
  {
    id: 202,
    mediaType: "tv",
    title: "Game of Thrones",
    overview:
      "Nove famílias nobres lutam pelo controle das terras milenares de Westeros. Uma antiga inimizade entre elas emerge com força total à medida que o inverno se aproxima.",
    posterPath: poster("got"),
    backdropPath: backdrop("got"),
    voteAverage: 9.3,
    voteCount: 22000,
    releaseDate: "2011-04-17",
    genreIds: [10765, 18, 12],
    popularity: 410.8,
  },
  {
    id: 203,
    mediaType: "tv",
    title: "Stranger Things",
    overview:
      "Quando um garoto desaparece, uma pequena cidade descobre um mistério envolvendo experimentos secretos, forças sobrenaturais aterrorizantes e uma estranha garotinha.",
    posterPath: poster("strangerthings"),
    backdropPath: backdrop("strangerthings"),
    voteAverage: 8.7,
    voteCount: 15000,
    releaseDate: "2016-07-15",
    genreIds: [10765, 9648, 18],
    popularity: 280.5,
  },
  {
    id: 204,
    mediaType: "tv",
    title: "The Last of Us",
    overview:
      "Após uma pandemia devastadora que transforma os infectados em canibais, um sobreviviente endurece recebe a missão de contrabandear uma garota imune para fora de uma zona de quarentena.",
    posterPath: poster("thelastofus"),
    backdropPath: backdrop("thelastofus"),
    voteAverage: 8.9,
    voteCount: 9500,
    releaseDate: "2023-01-15",
    genreIds: [18, 10765, 28],
    popularity: 380.1,
  },
  {
    id: 205,
    mediaType: "tv",
    title: "Peaky Blinders",
    overview:
      "Um clã gangster do início do século XX em Birmingham, Inglaterra, lidera uma gangue de rua urbana e entra em conflito com figuras poderosas.",
    posterPath: poster("peakyblinders"),
    backdropPath: backdrop("peakyblinders"),
    voteAverage: 8.8,
    voteCount: 11000,
    releaseDate: "2013-09-12",
    genreIds: [18, 80],
    popularity: 195.3,
  },
  {
    id: 206,
    mediaType: "tv",
    title: "Dark",
    overview:
      "A desaparição de crianças em uma pequena cidade alemã revela uma conspiração de viagem no tempo que conecta quatro famílias.",
    posterPath: poster("dark"),
    backdropPath: backdrop("dark"),
    voteAverage: 8.8,
    voteCount: 8500,
    releaseDate: "2017-12-01",
    genreIds: [10765, 9648, 18],
    popularity: 160.4,
  },
];

// ---------------------------------------------------------------------------
// DOCUMENTÁRIOS
// ---------------------------------------------------------------------------
const MOCK_DOCS: MediaItem[] = [
  {
    id: 301,
    mediaType: "tv",
    title: "Planeta Terra II",
    overview:
      "David Attenborough narra histórias de vida selvagem ao redor do globo, em uma sequência deslumbrante de ilhas, montanhas, selvas, desertos, pastagens e cidades.",
    posterPath: poster("planetearth2"),
    backdropPath: backdrop("planetearth2"),
    voteAverage: 9.5,
    voteCount: 6500,
    releaseDate: "2016-11-06",
    genreIds: [99],
    popularity: 88.4,
  },
  {
    id: 302,
    mediaType: "tv",
    title: "The Last Dance",
    overview:
      "Documentário que explora a carreira do Chicago Bulls na década de 90 com foco em Michael Jordan, incluindo a temporada de 1997-98.",
    posterPath: poster("lastdance"),
    backdropPath: backdrop("lastdance"),
    voteAverage: 9.2,
    voteCount: 4700,
    releaseDate: "2020-04-19",
    genreIds: [99],
    popularity: 72.6,
  },
  {
    id: 303,
    mediaType: "tv",
    title: "Making a Murderer",
    overview:
      "Steven Avery, exonerado após 18 anos preso por um crime que não cometeu, enfrenta um novo processo por assassinato que levanta questões sobre o sistema de justiça.",
    posterPath: poster("makingamurderer"),
    backdropPath: backdrop("makingamurderer"),
    voteAverage: 8.6,
    voteCount: 3200,
    releaseDate: "2015-12-18",
    genreIds: [99, 80],
    popularity: 55.1,
  },
  {
    id: 304,
    mediaType: "tv",
    title: "Nosso Planeta",
    overview:
      "Narrado por David Attenborough, este documentário da Netflix explora as maravilhas do mundo natural e os impactos das mudanças climáticas.",
    posterPath: poster("ourplanet"),
    backdropPath: backdrop("ourplanet"),
    voteAverage: 9.1,
    voteCount: 4100,
    releaseDate: "2019-04-05",
    genreIds: [99],
    popularity: 90.2,
  },
  {
    id: 305,
    mediaType: "movie",
    title: "13ª Emenda",
    overview:
      "Uma exploração da interseção entre raça, justiça e prisão em massa nos Estados Unidos, focando os anos após o fim da escravidão.",
    posterPath: poster("13th"),
    backdropPath: backdrop("13th"),
    voteAverage: 8.2,
    voteCount: 2100,
    releaseDate: "2016-10-07",
    genreIds: [99],
    popularity: 48.7,
  },
  {
    id: 306,
    mediaType: "movie",
    title: "Blackfish",
    overview:
      "Documental que conta a história de Tilikum, uma orca em cativeiro, e questiona a ética dos parques aquáticos que mantêm orcas para entretenimento.",
    posterPath: poster("blackfish"),
    backdropPath: backdrop("blackfish"),
    voteAverage: 8.1,
    voteCount: 2900,
    releaseDate: "2013-01-19",
    genreIds: [99],
    popularity: 42.3,
  },
];

const ALL_ITEMS = [...MOCK_MOVIES, ...MOCK_TV, ...MOCK_DOCS];

// ---------------------------------------------------------------------------
// Detalhes expandidos por ID
// ---------------------------------------------------------------------------
const MOCK_DETAILS: Record<number, Partial<MediaDetails>> = {
  101: {
    tagline: "Seja corajoso. Seja curioso. Seja corajoso.",
    status: "Released",
    genres: [
      { id: 18, name: "Drama" },
      { id: 878, name: "Ficção científica" },
      { id: 12, name: "Aventura" },
    ],
    runtime: 169,
    revenue: 677_463_182,
    budget: 165_000_000,
    cast: makeCast([
      "Matthew McConaughey",
      "Anne Hathaway",
      "Jessica Chastain",
      "Bill Irwin",
      "Ellen Burstyn",
      "Michael Caine",
    ]),
    videos: [makeTrailer("zSWdZVtXT7E", "Interestelar")],
  },
  102: {
    tagline: "Uma oferta que você não pode recusar.",
    status: "Released",
    genres: [
      { id: 18, name: "Drama" },
      { id: 80, name: "Crime" },
    ],
    runtime: 175,
    cast: makeCast([
      "Marlon Brando",
      "Al Pacino",
      "James Caan",
      "Richard Castellano",
      "Robert Duvall",
      "Diane Keaton",
    ]),
    videos: [makeTrailer("sY1S34973zA", "O Poderoso Chefão")],
  },
  103: {
    tagline: "Em Tyler nós confiamos.",
    status: "Released",
    genres: [
      { id: 18, name: "Drama" },
      { id: 53, name: "Thriller" },
    ],
    runtime: 139,
    cast: makeCast([
      "Brad Pitt",
      "Edward Norton",
      "Helena Bonham Carter",
      "Meat Loaf",
      "Zach Grenier",
      "Jared Leto",
    ]),
    videos: [makeTrailer("qtRKdVHc-cE", "Clube da Luta")],
  },
  104: {
    tagline: "A luta de classes mais assustadora.",
    status: "Released",
    genres: [
      { id: 35, name: "Comédia" },
      { id: 18, name: "Drama" },
      { id: 53, name: "Thriller" },
    ],
    runtime: 132,
    cast: makeCast([
      "Song Kang-ho",
      "Lee Sun-kyun",
      "Cho Yeo-jeong",
      "Choi Woo-shik",
      "Park So-dam",
      "Jang Hye-jin",
    ]),
    videos: [makeTrailer("5xH0HfJHsaY", "Parasita")],
  },
  105: {
    tagline: "O mundo mudou para sempre.",
    status: "Released",
    genres: [
      { id: 18, name: "Drama" },
      { id: 36, name: "História" },
    ],
    runtime: 180,
    budget: 100_000_000,
    revenue: 952_000_000,
    cast: makeCast([
      "Cillian Murphy",
      "Emily Blunt",
      "Matt Damon",
      "Robert Downey Jr.",
      "Florence Pugh",
      "Josh Hartnett",
    ]),
    videos: [makeTrailer("uYPbbksJxIg", "Oppenheimer")],
  },
  106: {
    tagline: "Quem salva uma vida salva o mundo inteiro.",
    status: "Released",
    genres: [
      { id: 18, name: "Drama" },
      { id: 36, name: "História" },
      { id: 10752, name: "Guerra" },
    ],
    runtime: 195,
    cast: makeCast([
      "Liam Neeson",
      "Ben Kingsley",
      "Ralph Fiennes",
      "Caroline Goodall",
      "Jonathan Sagall",
      "Embeth Davidtz",
    ]),
    videos: [makeTrailer("gG22XNhtnoY", "A Lista de Schindler")],
  },
  201: {
    tagline: "Todo negócio tem um preço.",
    status: "Ended",
    genres: [
      { id: 18, name: "Drama" },
      { id: 80, name: "Crime" },
    ],
    numberOfSeasons: 5,
    numberOfEpisodes: 62,
    cast: makeCast([
      "Bryan Cranston",
      "Aaron Paul",
      "Anna Gunn",
      "Betsy Brandt",
      "Dean Norris",
      "Bob Odenkirk",
    ]),
    videos: [makeTrailer("HhesaQXLuRY", "Breaking Bad")],
  },
  202: {
    tagline: "O inverno está chegando.",
    status: "Ended",
    genres: [
      { id: 10765, name: "Sci-Fi & Fantasia" },
      { id: 18, name: "Drama" },
      { id: 12, name: "Aventura" },
    ],
    numberOfSeasons: 8,
    numberOfEpisodes: 73,
    cast: makeCast([
      "Emilia Clarke",
      "Kit Harington",
      "Peter Dinklage",
      "Lena Headey",
      "Nikolaj Coster-Waldau",
      "Sophie Turner",
    ]),
    videos: [makeTrailer("KPLWWIOCOOQ", "Game of Thrones")],
  },
  203: {
    tagline: "A série original Netflix mais assistida do mundo.",
    status: "Returning Series",
    genres: [
      { id: 10765, name: "Sci-Fi & Fantasia" },
      { id: 9648, name: "Mistério" },
      { id: 18, name: "Drama" },
    ],
    numberOfSeasons: 4,
    numberOfEpisodes: 34,
    cast: makeCast([
      "Millie Bobby Brown",
      "Finn Wolfhard",
      "Winona Ryder",
      "David Harbour",
      "Gaten Matarazzo",
      "Caleb McLaughlin",
    ]),
    videos: [makeTrailer("b9EkMc79ZSU", "Stranger Things")],
  },
  204: {
    tagline: "Esta é a lei da natureza.",
    status: "Returning Series",
    genres: [
      { id: 18, name: "Drama" },
      { id: 10765, name: "Sci-Fi & Fantasia" },
      { id: 28, name: "Ação" },
    ],
    numberOfSeasons: 2,
    numberOfEpisodes: 17,
    cast: makeCast([
      "Pedro Pascal",
      "Bella Ramsey",
      "Anna Torv",
      "Nick Offerman",
      "Storm Reid",
      "Merle Dandridge",
    ]),
    videos: [makeTrailer("uLtkt8BonwM", "The Last of Us")],
  },
  205: {
    tagline: "Por ouro, opium e sangue.",
    status: "Ended",
    genres: [
      { id: 18, name: "Drama" },
      { id: 80, name: "Crime" },
    ],
    numberOfSeasons: 6,
    numberOfEpisodes: 36,
    cast: makeCast([
      "Cillian Murphy",
      "Paul Anderson",
      "Helen McCrory",
      "Sophie Rundle",
      "Sam Neill",
      "Tom Hardy",
    ]),
    videos: [makeTrailer("oVzVdvGIC7U", "Peaky Blinders")],
  },
  206: {
    tagline: "O tempo é uma fita de Möbius.",
    status: "Ended",
    genres: [
      { id: 10765, name: "Sci-Fi & Fantasia" },
      { id: 9648, name: "Mistério" },
      { id: 18, name: "Drama" },
    ],
    numberOfSeasons: 3,
    numberOfEpisodes: 26,
    cast: makeCast([
      "Louis Hofmann",
      "Lisa Vicari",
      "Maja Schöne",
      "Oliver Masucci",
      "Karoline Eichhorn",
      "Jördis Triebel",
    ]),
    videos: [makeTrailer("rrwycJ08PSA", "Dark")],
  },
  301: {
    tagline: "A vida encontra um caminho.",
    status: "Ended",
    genres: [{ id: 99, name: "Documentário" }],
    numberOfSeasons: 1,
    numberOfEpisodes: 6,
    cast: [],
    videos: [makeTrailer("c8aFcHFu8QM", "Planeta Terra II")],
  },
  302: {
    tagline: "O maior time de todos os tempos.",
    status: "Ended",
    genres: [{ id: 99, name: "Documentário" }],
    numberOfSeasons: 1,
    numberOfEpisodes: 10,
    cast: [],
    videos: [makeTrailer("HDG8UiNFyUw", "The Last Dance")],
  },
  303: {
    tagline: "Quem é o criminoso?",
    status: "Ended",
    genres: [
      { id: 99, name: "Documentário" },
      { id: 80, name: "Crime" },
    ],
    numberOfSeasons: 2,
    numberOfEpisodes: 20,
    cast: [],
    videos: [makeTrailer("NF3TRnzZeGE", "Making a Murderer")],
  },
  304: {
    tagline: "Um mundo que vale salvar.",
    status: "Ended",
    genres: [{ id: 99, name: "Documentário" }],
    numberOfSeasons: 2,
    numberOfEpisodes: 16,
    cast: [],
    videos: [makeTrailer("GfO-3Oir-qM", "Nosso Planeta")],
  },
  305: {
    tagline: "Nenhuma pessoa deve ser definida por seu pior momento.",
    status: "Released",
    genres: [{ id: 99, name: "Documentário" }],
    runtime: 100,
    cast: [],
    videos: [makeTrailer("krfcq5pF8u8", "13ª Emenda")],
  },
  306: {
    tagline: "Nunca capture o que você não pode controlar.",
    status: "Released",
    genres: [{ id: 99, name: "Documentário" }],
    runtime: 83,
    cast: [],
    videos: [makeTrailer("fLOp7vkwIbQ", "Blackfish")],
  },
};

// ---------------------------------------------------------------------------
// Providers por item (BR)
// ---------------------------------------------------------------------------
const MOCK_PROVIDERS_MAP: Record<number, WatchProvidersByType> = {
  101: {
    link: "https://www.themoviedb.org/movie/101/watch?locale=BR",
    flatrate: [PROVIDERS.prime, PROVIDERS.paramount],
  },
  102: {
    link: "https://www.themoviedb.org/movie/102/watch?locale=BR",
    flatrate: [PROVIDERS.prime],
    rent: [PROVIDERS.prime, PROVIDERS.apple],
    buy: [PROVIDERS.apple],
  },
  103: {
    link: "https://www.themoviedb.org/movie/103/watch?locale=BR",
    flatrate: [PROVIDERS.prime, PROVIDERS.hbo],
    rent: [PROVIDERS.prime],
  },
  104: {
    link: "https://www.themoviedb.org/movie/104/watch?locale=BR",
    flatrate: [PROVIDERS.netflix, PROVIDERS.prime],
  },
  105: {
    link: "https://www.themoviedb.org/movie/105/watch?locale=BR",
    flatrate: [PROVIDERS.prime],
    rent: [PROVIDERS.apple, PROVIDERS.prime],
    buy: [PROVIDERS.apple],
  },
  106: {
    link: "https://www.themoviedb.org/movie/106/watch?locale=BR",
    flatrate: [PROVIDERS.prime, PROVIDERS.netflix],
  },
  201: {
    link: "https://www.themoviedb.org/tv/201/watch?locale=BR",
    flatrate: [PROVIDERS.netflix, PROVIDERS.prime],
  },
  202: {
    link: "https://www.themoviedb.org/tv/202/watch?locale=BR",
    flatrate: [PROVIDERS.hbo, PROVIDERS.prime],
    rent: [PROVIDERS.prime],
  },
  203: {
    link: "https://www.themoviedb.org/tv/203/watch?locale=BR",
    flatrate: [PROVIDERS.netflix],
  },
  204: {
    link: "https://www.themoviedb.org/tv/204/watch?locale=BR",
    flatrate: [PROVIDERS.hbo],
  },
  205: {
    link: "https://www.themoviedb.org/tv/205/watch?locale=BR",
    flatrate: [PROVIDERS.netflix, PROVIDERS.prime],
  },
  206: {
    link: "https://www.themoviedb.org/tv/206/watch?locale=BR",
    flatrate: [PROVIDERS.netflix],
  },
  301: {
    link: "https://www.themoviedb.org/tv/301/watch?locale=BR",
    flatrate: [PROVIDERS.netflix],
  },
  302: {
    link: "https://www.themoviedb.org/tv/302/watch?locale=BR",
    flatrate: [PROVIDERS.netflix],
  },
  303: {
    link: "https://www.themoviedb.org/tv/303/watch?locale=BR",
    flatrate: [PROVIDERS.netflix],
  },
  304: {
    link: "https://www.themoviedb.org/tv/304/watch?locale=BR",
    flatrate: [PROVIDERS.netflix],
  },
  305: {
    link: "https://www.themoviedb.org/movie/305/watch?locale=BR",
    flatrate: [PROVIDERS.netflix],
  },
  306: {
    link: "https://www.themoviedb.org/movie/306/watch?locale=BR",
    flatrate: [PROVIDERS.prime],
    rent: [PROVIDERS.apple, PROVIDERS.prime],
  },
};

// ---------------------------------------------------------------------------
// Funções públicas do mock (mesma assinatura das reais do tmdb.ts)
// ---------------------------------------------------------------------------

function paginate<T>(
  items: T[],
  page: number,
  perPage = 20
): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  return {
    page,
    results: items.slice(start, start + perPage),
    totalResults: total,
    totalPages,
  };
}

export function mockTrending(
  type: "all" | "movie" | "tv",
  page = 1
): TrendingResult {
  let items: MediaItem[];
  if (type === "movie") items = MOCK_MOVIES;
  else if (type === "tv") items = [...MOCK_TV, ...MOCK_DOCS];
  else items = ALL_ITEMS;
  return paginate(items, page);
}

export function mockSearch(query: string, page = 1): SearchResult {
  const q = query.toLowerCase();
  const results = ALL_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.overview.toLowerCase().includes(q)
  );
  return paginate(results, page);
}

export function mockDetails(
  type: MediaType,
  id: number
): MediaDetails | null {
  const base = ALL_ITEMS.find((i) => i.id === id && i.mediaType === type);
  if (!base) return null;

  const extra = MOCK_DETAILS[id] ?? {};

  const similar = ALL_ITEMS.filter(
    (i) =>
      i.id !== id &&
      i.mediaType === type &&
      i.genreIds.some((g) => base.genreIds.includes(g))
  ).slice(0, 8);

  return {
    ...base,
    tagline: extra.tagline ?? "",
    status: extra.status ?? "Released",
    genres: extra.genres ?? [],
    runtime: extra.runtime,
    revenue: extra.revenue,
    budget: extra.budget,
    numberOfSeasons: extra.numberOfSeasons,
    numberOfEpisodes: extra.numberOfEpisodes,
    cast: extra.cast ?? [],
    videos: extra.videos ?? [],
    similar,
  };
}

export function mockProviders(
  _type: MediaType,
  id: number
): WatchProvidersByType | null {
  return MOCK_PROVIDERS_MAP[id] ?? null;
}

export function mockDiscover(
  type: MediaType,
  genreId: number | null,
  page = 1
): DiscoverResult {
  let pool = ALL_ITEMS.filter((i) => i.mediaType === type);
  if (genreId !== null) {
    pool = pool.filter((i) => i.genreIds.includes(genreId));
  }
  return paginate(pool, page);
}
