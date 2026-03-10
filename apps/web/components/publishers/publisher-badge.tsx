import { cn } from "@/lib/utils/cn";

export function PublisherBadge({
  isVerified,
  isEcosystemPartner,
  className,
}: {
  isVerified: boolean | null;
  isEcosystemPartner: boolean | null;
  className?: string;
}) {
  if (!isVerified && !isEcosystemPartner) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {isVerified && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/[0.06] px-2.5 py-[3px] text-[11px] font-medium text-purple-400">
          <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.41 5.59L7 10l-2.41-2.41L5.3 6.88 7 8.59l3.71-3.71.7.71z" />
          </svg>
          Verified
        </span>
      )}
      {isEcosystemPartner && (
        <span className="inline-flex items-center rounded-full border border-purple-400/15 bg-purple-400/[0.05] px-2.5 py-[3px] text-[11px] font-medium text-purple-300">
          Ecosystem Partner
        </span>
      )}
    </div>
  );
}
