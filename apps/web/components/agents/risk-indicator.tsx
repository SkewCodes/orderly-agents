import { cn } from "@/lib/utils/cn";

const riskConfig = {
  low: { color: "bg-emerald-400", glow: "shadow-[0_0_6px_rgba(34,197,94,0.4)]", label: "Low Risk" },
  medium: { color: "bg-amber-400", glow: "shadow-[0_0_6px_rgba(245,158,11,0.4)]", label: "Medium" },
  high: { color: "bg-red-400", glow: "shadow-[0_0_6px_rgba(239,68,68,0.4)]", label: "High Risk" },
  degen: { color: "bg-red-500", glow: "shadow-[0_0_6px_rgba(220,38,38,0.5)]", label: "Degen" },
} as const;

export function RiskIndicator({
  level,
  showLabel = false,
  className,
}: {
  level: keyof typeof riskConfig;
  showLabel?: boolean;
  className?: string;
}) {
  const config = riskConfig[level];
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className={cn("h-[7px] w-[7px] rounded-full", config.color, config.glow)} />
      {showLabel && (
        <span className="text-[11px] font-medium text-text-muted">{config.label}</span>
      )}
    </span>
  );
}
