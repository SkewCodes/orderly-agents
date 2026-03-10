"use client";

import { cn } from "@/lib/utils/cn";

const divisionTabs = [
  { value: "all", label: "All", icon: "◈" },
  { value: "trading", label: "Trading", icon: "◇" },
  { value: "building", label: "Building", icon: "⬡" },
  { value: "analytics", label: "Analytics", icon: "△" },
  { value: "social", label: "Social", icon: "○" },
  { value: "starchild", label: "Starchild AI", icon: "✦" },
  { value: "infra", label: "Infrastructure", icon: "⊞" },
] as const;

export function DivisionFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {divisionTabs.map((tab) => {
        const isActive = value === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative flex items-center gap-1.5 rounded-full px-4 py-[7px] text-[13px] font-medium tracking-[-0.01em] transition-all duration-300",
              isActive
                ? "text-white"
                : "text-text-muted hover:text-text-secondary"
            )}
          >
            {isActive && (
              <span className="absolute inset-0 rounded-full bg-purple-500/[0.12] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.08),0_0_12px_rgba(139,92,246,0.1)]" />
            )}
            <span className={cn("relative text-[11px]", isActive && "text-purple-400")}>
              {tab.icon}
            </span>
            <span className="relative">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
