export default function AgentDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 animate-pulse rounded-xl bg-purple-500/10" />
            <div className="space-y-2">
              <div className="h-7 w-48 animate-pulse rounded bg-white/5" />
              <div className="h-4 w-32 animate-pulse rounded bg-white/5" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-white/5" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-white/5" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-32 animate-pulse rounded-xl border border-[var(--border-subtle)] bg-bg-card" />
          <div className="h-48 animate-pulse rounded-xl border border-[var(--border-subtle)] bg-bg-card" />
        </div>
      </div>
    </div>
  );
}
