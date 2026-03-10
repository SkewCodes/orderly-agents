"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="hero-glow relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-5 text-center">
      <div className="animate-fade-in-up relative">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="text-[24px] font-bold tracking-[-0.02em] text-text-primary">
          Something went wrong
        </h1>
        <p className="mt-2 text-[14px] text-text-secondary">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={reset}
          className="group relative mt-8 overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-[9px] text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:brightness-110"
        >
          <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
          <span className="relative">Try Again</span>
        </button>
      </div>
    </div>
  );
}
