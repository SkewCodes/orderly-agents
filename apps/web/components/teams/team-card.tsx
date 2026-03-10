import Link from "next/link";
import { TierBadge } from "./tier-badge";
import { RuntimeBadge } from "@/components/agents/runtime-badge";
import { formatNumber, formatVolume } from "@/lib/utils/format";

interface AgentPreview {
  id: string;
  name: string;
  slug: string;
  iconEmoji: string | null;
  runtime: "skill" | "mcp" | "hosted" | "hybrid";
  description: string;
}

interface TeamCardProps {
  team: {
    slug: string;
    displayName: string;
    tier: "diamond" | "platinum" | "gold" | "silver" | "bronze";
    tagline: string | null;
    logoUrl: string | null;
    logoColor: string | null;
    memberCount: number | null;
    totalVolume: string | null;
    agentCount: number | null;
    agents: AgentPreview[];
  };
}

export function TeamCard({ team }: TeamCardProps) {
  const color = team.logoColor ?? "#7C3AED";

  return (
    <Link href={`/teams/${team.slug}`} className="card-grid-item group block">
      <div className="glass-card card-hover relative overflow-hidden rounded-2xl p-5">
        {/* Ambient color glow from team's brand */}
        <div
          className="absolute -top-20 -right-20 h-40 w-40 rounded-full opacity-[0.06] blur-[60px] transition-opacity duration-500 group-hover:opacity-[0.12]"
          style={{ backgroundColor: color }}
        />

        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-[16px] font-bold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}99)`,
                boxShadow: `0 4px 20px ${color}30`,
              }}
            >
              {team.displayName.charAt(0)}
            </div>
            <div>
              <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-text-primary transition-colors duration-200 group-hover:text-white">
                {team.displayName}
              </h3>
              {team.tagline && (
                <p className="mt-0.5 text-[12px] text-text-muted line-clamp-1">
                  {team.tagline}
                </p>
              )}
            </div>
          </div>
          <TierBadge tier={team.tier} />
        </div>

        <div className="relative mt-4 flex items-center gap-4">
          {[
            { value: formatNumber(team.memberCount ?? 0), label: "traders" },
            { value: formatVolume(team.totalVolume), label: "volume" },
            { value: `${team.agentCount ?? 0}`, label: "agents" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-1">
              <span className="text-[13px] font-medium text-text-secondary">
                {stat.value}
              </span>
              <span className="text-[11px] text-text-muted">{stat.label}</span>
            </div>
          ))}
        </div>

        {team.agents.length > 0 && (
          <div className="relative mt-4 space-y-1.5">
            {team.agents.slice(0, 3).map((agent) => (
              <div
                key={agent.id}
                className="flex items-center gap-2.5 rounded-xl bg-white/[0.02] px-3 py-[9px] transition-colors duration-200 group-hover:bg-white/[0.035]"
              >
                <span className="text-[14px]">{agent.iconEmoji ?? "🤖"}</span>
                <span className="flex-1 truncate text-[13px] text-text-secondary">
                  {agent.name}
                </span>
                <RuntimeBadge runtime={agent.runtime} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export function CTATeamCard() {
  return (
    <a
      href="https://orderly.network/build"
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="card-hover flex h-full min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.06] bg-transparent p-6 text-center transition-all duration-300 hover:border-purple-500/20 hover:bg-purple-500/[0.02]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/[0.1] to-purple-900/[0.06] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.06)] transition-transform duration-300 group-hover:scale-110">
          <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <h3 className="mt-3 text-[14px] font-semibold text-text-secondary">
          Your DEX
        </h3>
        <p className="mt-1 text-[12px] leading-relaxed text-text-muted">
          Build on Orderly and curate
          <br />
          your own agent team
        </p>
      </div>
    </a>
  );
}
