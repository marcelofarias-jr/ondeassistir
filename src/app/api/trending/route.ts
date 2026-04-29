import { getTrending } from "@/lib/tmdb";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = (searchParams.get("type") ?? "all") as "all" | "movie" | "tv";
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  try {
    const data = await getTrending(type, page);
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return Response.json({ error: message }, { status: 500 });
  }
}
