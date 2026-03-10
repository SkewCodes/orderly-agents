import { GridSkeleton } from "@/components/shared/loading-states";

export default function TeamDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 h-40 animate-pulse rounded-xl border border-[var(--border-subtle)] bg-bg-card" />
      <GridSkeleton count={5} />
    </div>
  );
}
