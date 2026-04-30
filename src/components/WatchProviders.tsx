import Image from "next/image";
import type { WatchProvidersByType, WatchProvider } from "@/lib/types";
import { getImageUrl } from "@/lib/tmdb";
import { useState } from "react";

interface Props {
  providers: WatchProvidersByType;
  tmdbLink?: string;
}

// ─── Badge de qualidade ───────────────────────────────────────────────────────

function QualityBadge({ quality }: { quality?: string }) {
  if (!quality) return null;
  const label = quality === "4K" ? "4K" : quality === "HD" ? "HD" : null;
  if (!label) return null;
  return (
    <span
      className={`absolute top-1 left-1 text-[9px] font-black px-1 rounded leading-tight ${
        label === "4K" ? "bg-yellow-400 text-black" : "bg-zinc-700 text-white"
      }`}
    >
      {label}
    </span>
  );
}

// ─── Logo clicável (flatrate / free) ─────────────────────────────────────────

function ProviderLogo({ p }: { p: WatchProvider }) {
  const logoSrc = getImageUrl(p.logoPath, "w200");
  const [imgError, setImgError] = useState(false);
  const inner = (
    <div className="flex flex-col items-center gap-1.5 w-16">
      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700">
        {logoSrc && !imgError ? (
          <Image
            src={logoSrc}
            alt={p.providerName}
            width={48}
            height={48}
            className="w-full h-full object-cover"
            unoptimized={
              logoSrc.startsWith("https://media.") ||
              logoSrc.startsWith("https://cdn")
            }
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-[9px] text-center p-1 leading-tight">
            {p.providerName}
          </div>
        )}
        <QualityBadge quality={p.quality} />
      </div>
      <span className="text-zinc-500 text-[10px] text-center leading-tight line-clamp-2">
        {p.providerName}
      </span>
    </div>
  );
  if (p.watchLink) {
    return (
      <a
        href={p.watchLink}
        target="_blank"
        rel="noopener noreferrer"
        title={`Assistir em ${p.providerName}`}
        className="hover:scale-105 transition-transform"
      >
        {inner}
      </a>
    );
  }
  return inner;
}

// ─── Logo com preço (rent / buy) ─────────────────────────────────────────────

function RentBuyLogo({ p }: { p: WatchProvider }) {
  const logoSrc = getImageUrl(p.logoPath, "w200");
  const [imgError, setImgError] = useState(false);
  const priceLabel =
    p.price !== undefined
      ? p.price === 0
        ? "Grátis"
        : `R$ ${p.price.toFixed(2)}`
      : null;
  const inner = (
    <div className="flex flex-col items-center gap-1 w-20">
      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700">
        {logoSrc && !imgError ? (
          <Image
            src={logoSrc}
            alt={p.providerName}
            width={48}
            height={48}
            className="w-full h-full object-cover"
            unoptimized={
              logoSrc.startsWith("https://media.") ||
              logoSrc.startsWith("https://cdn")
            }
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-[9px] text-center p-1 leading-tight">
            {p.providerName}
          </div>
        )}
        <QualityBadge quality={p.quality} />
      </div>
      <span className="text-zinc-500 text-[10px] text-center leading-tight line-clamp-2">
        {p.providerName}
      </span>
      {priceLabel && (
        <span className="text-[10px] text-zinc-400 mt-0.5">{priceLabel}</span>
      )}
    </div>
  );
  if (p.watchLink) {
    return (
      <a
        href={p.watchLink}
        target="_blank"
        rel="noopener noreferrer"
        title={
          priceLabel ? `${p.providerName} — ${priceLabel}` : p.providerName
        }
        onError={() => setImgError(true)}
        className="hover:scale-105 transition-transform"
      >
        {inner}
      </a>
    );
  }
  return inner;
}

// ─── Grupo de providers ────────────────────────────────────────────────────────

function ProviderGroup({
  label,
  providers,
  variant = "default",
}: {
  label: string;
  providers: WatchProvider[];
  variant?: "default" | "price";
}) {
  if (!providers.length) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
        {label}
      </p>
      <div className="flex flex-wrap gap-3">
        {providers.map((p) =>
          variant === "price" ? (
            <RentBuyLogo key={`${p.providerId}-${p.providerName}`} p={p} />
          ) : (
            <ProviderLogo key={`${p.providerId}-${p.providerName}`} p={p} />
          ),
        )}
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function WatchProviders({ providers, tmdbLink }: Props) {
  const hasAny =
    providers.flatrate?.length ||
    providers.rent?.length ||
    providers.buy?.length ||
    providers.free?.length;

  // Detecta se algum provider veio de múltiplas fontes (cruzamento)
  const allProviders = [
    ...(providers.flatrate ?? []),
    ...(providers.rent ?? []),
    ...(providers.buy ?? []),
    ...(providers.free ?? []),
  ];
  const crossChecked = allProviders.some(
    (p) => (p.confirmedBy?.length ?? 0) >= 2,
  );

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-5 gap-3">
        <div>
          <h2 className="text-white font-bold text-xl">
            Onde Assistir no Brasil
          </h2>
          {crossChecked && (
            <p className="flex items-center gap-1.5 mt-1">
              <span className="bg-green-900/40 border border-green-800/50 text-green-400 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                ✓ dados cruzados
              </span>
              <span className="text-zinc-600 text-[10px]">
                múltiplas fontes verificadas
              </span>
            </p>
          )}
        </div>
        {tmdbLink && (
          <a
            href={tmdbLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-white transition-colors shrink-0"
          >
            Ver no TMDB →
          </a>
        )}
      </div>

      {hasAny ? (
        <div className="flex flex-col gap-6">
          <ProviderGroup
            label="Incluído no streaming"
            providers={providers.flatrate ?? []}
          />
          <ProviderGroup
            label="Grátis com anúncios"
            providers={providers.free ?? []}
          />
          <ProviderGroup
            label="Alugar"
            providers={providers.rent ?? []}
            variant="price"
          />
          <ProviderGroup
            label="Comprar"
            providers={providers.buy ?? []}
            variant="price"
          />
        </div>
      ) : (
        <p className="text-zinc-500 text-sm">
          Nenhum provedor de streaming encontrado para o Brasil no momento.
        </p>
      )}

      {/* Atribuições obrigatórias pelos ToS da TMDB e Watchmode */}
      <p className="text-zinc-700 text-xs mt-5 pt-4 border-t border-zinc-800">
        Dados por{" "}
        <a
          href="https://www.justwatch.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-500 underline transition-colors"
        >
          JustWatch
        </a>
        {" · "}
        <a
          href="https://api.watchmode.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-500 underline transition-colors"
        >
          Watchmode
        </a>
        {" · "}
        <a
          href="https://www.movieofthenight.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-500 underline transition-colors"
        >
          Streaming Availability
        </a>
      </p>
    </div>
  );
}
