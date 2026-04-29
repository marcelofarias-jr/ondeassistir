import { GridSkeleton } from "@/components/Skeleton";

export default function SeriesLoading() {
  return (
    <main className="min-h-screen pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="h-9 w-20 bg-zinc-800/60 rounded-lg animate-pulse mb-6" />
        <div className="h-10 w-full bg-zinc-800/60 rounded-full animate-pulse mb-8" />
        <GridSkeleton />
      </div>
    </main>
  );
}
