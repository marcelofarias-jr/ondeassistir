import { HeroSkeleton, CarouselSkeleton } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <main className="flex flex-col flex-1">
      <HeroSkeleton />
      <div className="bg-black flex flex-col gap-2 pb-12 -mt-16 relative z-10">
        <CarouselSkeleton title="Filmes em Alta" />
        <CarouselSkeleton title="Séries em Alta" />
        <CarouselSkeleton title="Documentários" />
      </div>
    </main>
  );
}
