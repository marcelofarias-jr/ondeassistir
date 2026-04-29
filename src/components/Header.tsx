"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Menu, X, Play } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import SearchModal from "./SearchModal";

const NAV_ITEMS = [
  { label: "Início", href: "/" },
  { label: "Filmes", href: "/filmes" },
  { label: "Séries", href: "/series" },
  { label: "Documentários", href: "/documentarios" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // Guardar para qual pathname o menu foi aberto; derivar mobileOpen a partir disso
  const [menuPathname, setMenuPathname] = useState<string | null>(null);
  const mobileOpen = menuPathname === pathname;
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled || mobileOpen
            ? "bg-black shadow-lg"
            : "bg-linear-to-b from-black/80 to-transparent"
        )}
      >
        <div className="flex items-center justify-between px-4 md:px-8 h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-black text-xl shrink-0"
          >
            <Play size={18} fill="#e50914" className="text-[#e50914]" />
            <span className="text-white">
              onde<span className="text-[#e50914]">assistir</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 ml-10">
            {NAV_ITEMS.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={clsx(
                  "text-sm font-medium transition-colors",
                  pathname === n.href
                    ? "text-white"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar"
              className="p-2 text-zinc-300 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            >
              <Search size={20} />
            </button>
            <button
              className="md:hidden p-2 text-zinc-300 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              onClick={() => setMenuPathname((p) => p === pathname ? null : pathname)}
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="md:hidden bg-black border-t border-zinc-800 px-6 py-4 flex flex-col gap-4">
            {NAV_ITEMS.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={clsx(
                  "font-medium py-1 transition-colors",
                  pathname === n.href
                    ? "text-white"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}
