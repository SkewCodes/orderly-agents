import { cn } from "@/lib/utils/cn";

const tierConfig = {
  diamond: {
    label: "Diamond",
    bgClass: "bg-blue-400/[0.08] border-blue-400/20",
    textClass: "text-blue-400",
    dotClass: "bg-blue-400",
  },
  platinum: {
    label: "Platinum",
    bgClass: "bg-slate-300/[0.06] border-slate-300/20",
    textClass: "text-slate-300",
    dotClass: "bg-slate-300",
  },
  gold: {
    label: "Gold",
    bgClass: "bg-yellow-400/[0.08] border-yellow-400/20",
    textClass: "text-yellow-400",
    dotClass: "bg-yellow-400",
  },
  silver: {
    label: "Silver",
    bgClass: "bg-slate-400/[0.06] border-slate-400/20",
    textClass: "text-slate-400",
    dotClass: "bg-slate-400",
  },
  bronze: {
    label: "Bronze",
    bgClass: "bg-amber-600/[0.08] border-amber-600/20",
    textClass: "text-amber-500",
    dotClass: "bg-amber-500",
  },
} as const;

export function TierBadge({
  tier,
  className,
}: {
  tier: keyof typeof tierConfig;
  className?: string;
}) {
  const config = tierConfig[tier];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[11px] font-semibold leading-none",
        config.bgClass,
        config.textClass,
        className
      )}
    >
      <span
        className={cn(
          "h-[5px] w-[5px] rounded-full shadow-[0_0_4px_currentColor]",
          config.dotClass
        )}
      />
      {config.label}
    </span>
  );
}
