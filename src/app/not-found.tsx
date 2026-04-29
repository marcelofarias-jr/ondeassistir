import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página não encontrada — OndeAssistir",
};

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 min-h-[70vh] px-4 text-center">
      <p className="text-[#e50914] font-black text-7xl md:text-9xl tracking-tighter select-none">
        404
      </p>
      <h1 className="text-white text-2xl md:text-3xl font-black mt-4 mb-3">
        Ops! Essa página não existe.
      </h1>
      <p className="text-zinc-500 max-w-md mb-8">
        O conteúdo que você procura pode ter sido removido, o link pode estar
        quebrado, ou talvez você tenha digitado algo errado.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="px-6 py-2.5 bg-[#e50914] hover:bg-[#f40612] text-white font-semibold rounded-full transition-colors"
        >
          Ir para o início
        </Link>
        <Link
          href="/filmes"
          className="px-6 py-2.5 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 font-semibold rounded-full transition-colors"
        >
          Explorar filmes
        </Link>
      </div>
    </main>
  );
}
