import { GridSkeleton } from "@/components/shared/loading-states";

export default function TeamsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
      <div className="mb-14 text-center">
        <div className="mx-auto h-10 w-80 animate-shimmer rounded-xl bg-white/[0.04]" />
        <div className="mx-auto mt-5 h-5 w-[420px] animate-shimmer rounded-lg bg-white/[0.03]" />
      </div>
      <GridSkeleton count={4} />
    </div>
  );
}
