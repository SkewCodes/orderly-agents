"use client";

import Link from "next/link";
import { RuntimeBadge } from "./runtime-badge";
import { RiskIndicator } from "./risk-indicator";
import { formatNumber } from "@/lib/utils/format";

interface AgentCardProps {
  agent: {
    slug: string;
    name: string;
    description: string;
    division: string;
    runtime: "skill" | "mcp" | "hosted" | "hybrid";
    riskLevel: "low" | "medium" | "high" | "degen";
    iconEmoji: string | null;
    tags: string[] | null;
    starCount: number | null;
    installCount: number | null;
    publisherName: string;
    publisherSlug: string;
    publisherVerified: boolean | null;
  };
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Link href={`/marketplace/${agent.slug}`} className="card-grid-item group block">
      <div className="glass-card card-hover relative flex h-full flex-col overflow-hidden rounded-2xl p-5">
        {/* Top accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/[0.12] to-purple-900/[0.08] text-lg shadow-[inset_0_0.5px_0_rgba(255,255,255,0.06)]">
              {agent.iconEmoji ?? "🤖"}
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-semibold tracking-[-0.01em] text-text-primary transition-colors duration-200 group-hover:text-white">
                {agent.name}
              </h3>
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/publisher/${agent.publisherSlug}`}
                  className="truncate text-[12px] text-text-muted transition-colors duration-200 hover:text-purple-400"
                  onClick={(e) => e.stopPropagation()}
                >
                  {agent.publisherName}
                </Link>
                {agent.publisherVerified && (
                  <svg
                    className="h-3 w-3 shrink-0 text-purple-400"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 0a8 8 0 110 16A8 8 0 018 0zm3.41 5.59L7 10l-2.41-2.41L5.3 6.88 7 8.59l3.71-3.71.7.71z" />
                  </svg>
                )}
              </div>
            </div>
          </div>
          <RiskIndicator level={agent.riskLevel} />
        </div>

        <p className="mt-3 flex-1 text-[13px] leading-[1.6] text-text-secondary line-clamp-2">
          {agent.description}
        </p>

        {agent.tags && agent.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {agent.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-white/[0.04] px-2 py-[3px] text-[11px] font-medium text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-white/[0.04] pt-3">
          <RuntimeBadge runtime={agent.runtime} />
          <div className="flex items-center gap-3.5 text-[12px] text-text-muted">
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {formatNumber(agent.starCount ?? 0)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {formatNumber(agent.installCount ?? 0)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
