import Link from "next/link";

export default function NotFound() {
  return (
    <div className="hero-glow relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-5 text-center">
      <div className="animate-fade-in-up relative">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <svg className="h-8 w-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-text-primary">
          Page Not Found
        </h1>
        <p className="mt-2 text-[15px] text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/teams"
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-[9px] text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:brightness-110"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
            <span className="relative">Browse Teams</span>
          </Link>
          <Link
            href="/marketplace"
            className="rounded-full border border-white/[0.06] px-6 py-[9px] text-[13px] font-medium text-text-secondary transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.03]"
          >
            Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
