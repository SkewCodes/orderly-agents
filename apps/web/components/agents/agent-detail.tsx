"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { RuntimeBadge } from "./runtime-badge";

const ReactMarkdown = dynamic(() => import("react-markdown"), {
  loading: () => (
    <div className="space-y-2">
      <div className="h-4 w-full animate-shimmer rounded bg-white/[0.04]" />
      <div className="h-4 w-3/4 animate-shimmer rounded bg-white/[0.03]" />
    </div>
  ),
});
import { RiskIndicator } from "./risk-indicator";
import { InstallGuide } from "./install-guide";
import { useWallet } from "@/hooks/use-wallet";
import { useAgentStar, useAgentInstall } from "@/hooks/use-agents";
import { formatNumber } from "@/lib/utils/format";
import { getChainName } from "@/lib/utils/chains";
import { cn } from "@/lib/utils/cn";

type AgentData = {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string | null;
  division: string;
  runtime: "skill" | "mcp" | "hosted" | "hybrid";
  riskLevel: "low" | "medium" | "high" | "degen";
  status: string;
  iconEmoji: string | null;
  version: string;
  tags: string[] | null;
  supportedChains: string[] | null;
  brokerCompatibility: string | null;
  sourceRepoUrl: string | null;
  mcpServerUrl: string | null;
  skillFileUrl: string | null;
  starCount: number | null;
  installCount: number | null;
  activeInstances: number | null;
  configSchema: Record<string, unknown> | null;
  publisher: {
    id: string;
    slug: string;
    displayName: string;
    isVerified: boolean | null;
    isEcosystemPartner: boolean | null;
    avatarUrl: string | null;
  };
  relatedAgents: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    division: string;
    runtime: string;
    iconEmoji: string | null;
    starCount: number | null;
  }>;
  teamsUsing: Array<{
    teamId: string;
    teamName: string;
    teamSlug: string;
    teamLogoColor: string | null;
  }>;
  isStarred: boolean;
};

export function AgentDetail({ agent }: { agent: AgentData }) {
  const [tab, setTab] = useState<"overview" | "config">("overview");
  const [installOpen, setInstallOpen] = useState(false);
  const { isAuthenticated, signIn } = useWallet();
  const starMutation = useAgentStar();
  const installMutation = useAgentInstall();

  const handleStar = async () => {
    if (!isAuthenticated) {
      await signIn();
      return;
    }
    starMutation.mutate({ agentId: agent.id });
  };

  const handleInstall = async () => {
    if (!isAuthenticated) {
      await signIn();
      return;
    }
    const runtimeKey =
      agent.runtime === "hybrid" ? "mcp" : agent.runtime;
    installMutation.mutate(
      {
        agentId: agent.id,
        runtime: runtimeKey as "skill" | "mcp" | "hosted",
      },
      {
        onSuccess: (data) => {
          if (data.skillFileUrl) {
            window.open(data.skillFileUrl, "_blank");
          }
          if (data.mcpServerUrl) {
            navigator.clipboard.writeText(data.mcpServerUrl);
          }
        },
      }
    );
  };

  const isHosted = agent.runtime === "hosted";

  return (
    <div className="animate-fade-in grid gap-8 lg:grid-cols-[1fr_320px]">
      {/* Main Content */}
      <div>
        {/* Header */}
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/[0.12] to-purple-900/[0.08] text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_20px_rgba(0,0,0,0.2)]">
            {agent.iconEmoji ?? "🤖"}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-[24px] font-bold tracking-[-0.02em] text-text-primary">
                {agent.name}
              </h1>
              <span className="rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-text-muted">
                v{agent.version}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              <Link
                href={`/publisher/${agent.publisher.slug}`}
                className="text-[13px] text-text-muted transition-colors duration-200 hover:text-purple-400"
              >
                {agent.publisher.displayName}
                {agent.publisher.isVerified && (
                  <span className="ml-1 inline-block text-purple-400">✓</span>
                )}
              </Link>
              <RuntimeBadge runtime={agent.runtime} />
              <RiskIndicator level={agent.riskLevel} showLabel />
            </div>
          </div>
        </div>

        {/* Stats + Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={handleStar}
            disabled={starMutation.isPending}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-[8px] text-[13px] font-medium transition-all duration-300",
              agent.isStarred
                ? "border-purple-500/30 bg-purple-500/[0.08] text-purple-400 shadow-[0_0_12px_rgba(139,92,246,0.1)]"
                : "border-white/[0.06] text-text-secondary hover:border-white/[0.1] hover:bg-white/[0.03]"
            )}
          >
            <svg className="h-4 w-4" fill={agent.isStarred ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            {formatNumber(agent.starCount ?? 0)}
          </button>

          <span className="text-[13px] text-text-muted">
            {formatNumber(agent.installCount ?? 0)} installs
          </span>

          <button
            onClick={() => setInstallOpen(true)}
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-5 py-[8px] text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.2),0_1px_2px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:brightness-110"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
            <span className="relative">
              {agent.runtime === "skill"
                ? "Install Skill"
                : agent.runtime === "mcp"
                  ? "Connect MCP"
                  : agent.runtime === "hosted"
                    ? "Coming Soon"
                    : "Install"}
            </span>
          </button>

          <InstallGuide
            agent={{
              name: agent.name,
              slug: agent.slug,
              runtime: agent.runtime,
              skillFileUrl: agent.skillFileUrl,
              mcpServerUrl: agent.mcpServerUrl,
              hostedEndpoint: null,
              version: agent.version,
            }}
            open={installOpen}
            onClose={() => setInstallOpen(false)}
          />
        </div>

        {/* Tab Nav */}
        <div className="mt-8 flex gap-0.5 border-b border-white/[0.04]">
          {(
            [
              { key: "overview", label: "Overview" },
              { key: "config", label: "Configuration" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "relative px-4 py-2.5 text-[13px] font-medium transition-all duration-300",
                tab === t.key
                  ? "text-white"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              {tab === t.key && (
                <span className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
              )}
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6 animate-fade-in">
          {tab === "overview" && (
            <div className="space-y-6">
              <p className="text-[15px] leading-[1.7] text-text-secondary">
                {agent.description}
              </p>

              {agent.longDescription && (
                <div className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-[-0.02em] prose-headings:text-text-primary prose-p:text-[15px] prose-p:leading-[1.7] prose-p:text-text-secondary prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline prose-code:rounded-md prose-code:bg-white/[0.04] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[13px]">
                  <ReactMarkdown>{agent.longDescription}</ReactMarkdown>
                </div>
              )}

              {agent.supportedChains && agent.supportedChains.length > 0 && (
                <div>
                  <h3 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                    Supported Chains
                  </h3>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {agent.supportedChains.map((chain) => (
                      <span
                        key={chain}
                        className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-text-secondary"
                      >
                        {getChainName(chain)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {agent.sourceRepoUrl && (
                <div>
                  <h3 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                    Source Code
                  </h3>
                  <a
                    href={agent.sourceRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-purple-400 transition-colors duration-200 hover:text-purple-300"
                  >
                    View on GitHub
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          )}

          {tab === "config" && (
            <div>
              {agent.configSchema ? (
                <pre className="overflow-x-auto rounded-xl border border-white/[0.04] bg-white/[0.015] p-5 font-mono text-[12px] leading-[1.7] text-text-secondary">
                  {JSON.stringify(agent.configSchema, null, 2)}
                </pre>
              ) : (
                <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-8 text-center">
                  <p className="text-[14px] text-text-muted">
                    This agent has no configurable parameters.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-5">
        {/* Publisher Card */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
            Publisher
          </h3>
          <Link
            href={`/publisher/${agent.publisher.slug}`}
            className="mt-3 flex items-center gap-3 group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/[0.12] to-purple-900/[0.08] text-[13px] font-bold text-purple-400 shadow-[inset_0_0.5px_0_rgba(255,255,255,0.06)]">
              {agent.publisher.displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-primary transition-colors duration-200 group-hover:text-purple-400">
                {agent.publisher.displayName}
              </p>
              {agent.publisher.isEcosystemPartner && (
                <p className="text-[11px] text-purple-400/80">
                  Ecosystem Partner
                </p>
              )}
            </div>
          </Link>
        </div>

        {/* Teams Using */}
        {agent.teamsUsing.length > 0 && (
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
              Used by Teams
            </h3>
            <div className="mt-3 space-y-1">
              {agent.teamsUsing.map((team) => (
                <Link
                  key={team.teamId}
                  href={`/teams/${team.teamSlug}`}
                  className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-all duration-200 hover:bg-white/[0.03]"
                >
                  <div
                    className="h-6 w-6 rounded-lg text-center text-[11px] font-bold leading-6 text-white shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${team.teamLogoColor ?? "#7C3AED"}, ${team.teamLogoColor ?? "#7C3AED"}99)`,
                    }}
                  >
                    {team.teamName.charAt(0)}
                  </div>
                  <span className="text-[13px] text-text-secondary">
                    {team.teamName}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Agents */}
        {agent.relatedAgents.length > 0 && (
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
              Related Agents
            </h3>
            <div className="mt-3 space-y-1">
              {agent.relatedAgents.map((related) => (
                <Link
                  key={related.id}
                  href={`/marketplace/${related.slug}`}
                  className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-all duration-200 hover:bg-white/[0.03]"
                >
                  <span className="text-[14px]">
                    {related.iconEmoji ?? "🤖"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] text-text-secondary">
                      {related.name}
                    </p>
                  </div>
                  <span className="text-[11px] tabular-nums text-text-muted">
                    ★ {formatNumber(related.starCount ?? 0)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
