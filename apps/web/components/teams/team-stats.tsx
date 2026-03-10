import { formatNumber, formatVolume } from "@/lib/utils/format";

export function TeamStats({
  memberCount,
  totalVolume,
  agentCount,
}: {
  memberCount: number | null;
  totalVolume: string | null;
  agentCount: number | null;
}) {
  const stats = [
    { label: "Traders", value: formatNumber(memberCount ?? 0) },
    { label: "Volume", value: formatVolume(totalVolume) },
    { label: "Agents", value: String(agentCount ?? 0) },
  ];

  return (
    <div className="flex items-center gap-8">
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-[18px] font-semibold tabular-nums tracking-[-0.02em] text-text-primary">
              {stat.value}
            </p>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
              {stat.label}
            </p>
          </div>
          {i < stats.length - 1 && (
            <div className="h-8 w-px bg-white/[0.06]" />
          )}
        </div>
      ))}
    </div>
  );
}
