import { cn } from "@/lib/utils/cn";

const runtimeConfig = {
  skill: {
    label: "Skill",
    bgClass: "bg-indigo-500/[0.08] border-indigo-500/20",
    textClass: "text-indigo-400",
    dotClass: "bg-indigo-400",
  },
  mcp: {
    label: "MCP",
    bgClass: "bg-purple-500/[0.08] border-purple-500/20",
    textClass: "text-purple-400",
    dotClass: "bg-purple-400",
  },
  hosted: {
    label: "Hosted",
    bgClass: "bg-violet-500/[0.08] border-violet-500/20",
    textClass: "text-violet-300",
    dotClass: "bg-violet-400",
  },
  hybrid: {
    label: "Hybrid",
    bgClass: "bg-fuchsia-500/[0.08] border-fuchsia-500/20",
    textClass: "text-fuchsia-300",
    dotClass: "bg-fuchsia-400",
  },
} as const;

export function RuntimeBadge({
  runtime,
  className,
}: {
  runtime: keyof typeof runtimeConfig;
  className?: string;
}) {
  const config = runtimeConfig[runtime];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] font-mono text-[11px] font-medium leading-none",
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
