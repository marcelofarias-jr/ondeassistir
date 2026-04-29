"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

interface Props {
  defaultValue?: string;
}

export default function SearchInput({ defaultValue = "" }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (q) router.push(`/busca?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-xl px-4 max-w-xl">
      <Search size={18} className="text-zinc-500 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar filmes, séries, documentários..."
        className="flex-1 bg-transparent py-3 text-white placeholder-zinc-500 outline-none text-sm"
        autoFocus
      />
      <button
        type="submit"
        className="text-sm font-semibold text-[#e50914] hover:text-white transition-colors py-3"
      >
        Buscar
      </button>
    </form>
  );
}
