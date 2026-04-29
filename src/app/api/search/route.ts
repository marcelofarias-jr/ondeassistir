import { searchMedia } from "@/lib/tmdb";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  if (!query.trim()) {
    return Response.json({
      page: 1,
      results: [],
      totalResults: 0,
      totalPages: 0,
    });
  }

  try {
    const data = await searchMedia(query, page);
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return Response.json({ error: message }, { status: 500 });
  }
}
