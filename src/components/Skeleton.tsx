import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-lg bg-zinc-800/60", className)} />
  );
}

export function CardSkeleton() {
  return (
    <div className="shrink-0 w-37.5 sm:w-42.5 flex flex-col gap-2">
      <Skeleton className="w-full aspect-2/3 rounded-xl" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function CarouselSkeleton({ title }: { title?: string }) {
  return (
    <div className="px-4 md:px-8 py-6">
      {title && <Skeleton className="h-6 w-40 mb-4" />}
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <Skeleton className="w-full aspect-2/3 rounded-xl" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[80vh] min-h-130 animate-pulse">
      <div className="absolute inset-0 bg-zinc-900" />
      <div className="absolute bottom-16 left-8 md:left-16 flex flex-col gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-64 md:w-96" />
        <Skeleton className="h-4 w-80 md:w-[500px]" />
        <Skeleton className="h-4 w-64 md:w-[400px]" />
        <div className="flex gap-3 mt-2">
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="min-h-screen pt-16">
      {/* Backdrop */}
      <Skeleton className="h-[50vh] min-h-75 rounded-none" />
      <div className="px-4 md:px-8 pb-20 max-w-7xl mx-auto">
        <Skeleton className="h-4 w-24 mt-6 mb-8" />
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-48 md:w-64 aspect-2/3 rounded-xl shrink-0 -mt-32 md:-mt-48" />
          <div className="flex-1 flex flex-col gap-3 mt-4">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2 mt-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-7 w-20 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-44 w-full rounded-2xl mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
