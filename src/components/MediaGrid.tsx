import type { MediaItem } from "@/lib/types";
import MediaCard from "./MediaCard";

interface Props {
  items: MediaItem[];
  emptyMessage?: string;
}

export default function MediaGrid({
  items,
  emptyMessage = "Nenhum resultado encontrado.",
}: Props) {
  if (!items.length) {
    return (
      <div className="flex items-center justify-center py-24 text-zinc-500 text-lg">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 stagger">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
}
