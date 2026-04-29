import { getAggregatedProviders } from "@/lib/providers-aggregator";
import type { MediaType } from "@/lib/types";
import type { NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  const { type, id } = await params;

  if (type !== "movie" && type !== "tv") {
    return Response.json(
      { error: "Tipo inválido. Use 'movie' ou 'tv'." },
      { status: 400 },
    );
  }

  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return Response.json({ error: "ID inválido." }, { status: 400 });
  }

  try {
    const data = await getAggregatedProviders(type as MediaType, numericId);
    if (!data) {
      return Response.json(
        { error: "Sem provedores disponíveis no Brasil." },
        { status: 404 },
      );
    }
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return Response.json({ error: message }, { status: 500 });
  }
}
