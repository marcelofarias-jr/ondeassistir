import { GridSkeleton } from "@/components/Skeleton";

export default function DocumentariosLoading() {
  return (
    <main className="min-h-screen pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="h-9 w-44 bg-zinc-800/60 rounded-lg animate-pulse mb-6" />
        <GridSkeleton />
      </div>
    </main>
  );
}
