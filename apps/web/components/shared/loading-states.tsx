export function CardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.015] p-5">
      <div className="absolute inset-0 animate-shimmer" />
      <div className="relative flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/[0.04]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded-lg bg-white/[0.04]" />
          <div className="h-3 w-20 rounded-lg bg-white/[0.03]" />
        </div>
      </div>
      <div className="relative mt-4 space-y-2">
        <div className="h-3 w-full rounded-lg bg-white/[0.04]" />
        <div className="h-3 w-3/4 rounded-lg bg-white/[0.03]" />
      </div>
      <div className="relative mt-4 flex gap-2">
        <div className="h-5 w-16 rounded-full bg-white/[0.04]" />
        <div className="h-5 w-12 rounded-full bg-white/[0.03]" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <div className="h-8 w-64 animate-shimmer rounded-xl bg-white/[0.04]" />
        <div className="h-4 w-96 animate-shimmer rounded-lg bg-white/[0.03]" />
      </div>
      <GridSkeleton />
    </div>
  );
}

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-5 w-5 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-500 ${className}`}
    />
  );
}
