import { discoverMedia } from "@/lib/tmdb";
import type { MediaType } from "@/lib/types";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = (searchParams.get("type") ?? "movie") as MediaType;
  const genreParam = searchParams.get("genre");
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  if (type !== "movie" && type !== "tv") {
    return Response.json(
      { error: "Tipo inválido. Use 'movie' ou 'tv'." },
      { status: 400 },
    );
  }

  const genreId = genreParam ? parseInt(genreParam, 10) : null;

  try {
    const data = await discoverMedia(type, genreId, page);
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return Response.json({ error: message }, { status: 500 });
  }
}
