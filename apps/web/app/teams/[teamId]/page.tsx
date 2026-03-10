import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { serverCaller } from "@/lib/trpc/server";
import { TierBadge } from "@/components/teams/tier-badge";
import { TeamStats } from "@/components/teams/team-stats";
import { TeamRoster } from "@/components/teams/team-roster";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { getMockTeamDetail } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ teamId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { teamId } = await params;
  try {
    const caller = await serverCaller();
    const team = await caller.teams.getBySlug({ slug: teamId });
    if (!team) throw new Error("not found");
    return {
      title: `${team.displayName} Agent Team`,
      description:
        team.tagline ?? `${team.displayName}'s AI agent team on OrderlyAgents`,
    };
  } catch {
    const mock = getMockTeamDetail(teamId);
    if (mock) return { title: `${mock.displayName} Agent Team` };
    return { title: "Agent Teams" };
  }
}

export default async function TeamDetailPage({ params }: Props) {
  const { teamId } = await params;

  let team;
  try {
    const caller = await serverCaller();
    team = await caller.teams.getBySlug({ slug: teamId });
  } catch {
    team = null;
  }

  if (!team) {
    const mock = getMockTeamDetail(teamId);
    if (!mock) notFound();
    team = mock;
  }

  if (!team) notFound();

  const color = team.logoColor ?? "#7C3AED";

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Teams", href: "/teams" },
          { label: team.displayName },
        ]}
      />
      {/* Team Header */}
      <div className="animate-fade-in glass-card relative mb-10 overflow-hidden rounded-2xl p-6 sm:p-8">
        <div
          className="absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-[0.08] blur-[80px]"
          style={{ backgroundColor: color }}
        />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-[22px] font-bold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}99)`,
                boxShadow: `0 4px 24px ${color}25`,
              }}
            >
              {team.displayName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[24px] font-bold tracking-[-0.02em] text-text-primary">
                  {team.displayName}
                </h1>
                <TierBadge tier={team.tier} />
              </div>
              {team.tagline && (
                <p className="mt-1 text-[14px] text-text-secondary">
                  {team.tagline}
                </p>
              )}
              {team.websiteUrl && (
                <a
                  href={team.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-[13px] text-purple-400 transition-colors duration-200 hover:text-purple-300"
                >
                  {team.websiteUrl.replace(/^https?:\/\//, "")}
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TeamStats
              memberCount={team.memberCount}
              totalVolume={team.totalVolume}
              agentCount={team.agentCount}
            />
            <Link
              href={`/teams/${teamId}/settings`}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] text-text-muted transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.03] hover:text-text-secondary"
              aria-label="Team Settings"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Roster */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-text-primary">
          Agent Roster
        </h2>
        <span className="text-[13px] tabular-nums text-text-muted">
          {team.roster.length} agent{team.roster.length !== 1 ? "s" : ""}
        </span>
      </div>

      {team.roster.length > 0 ? (
        <div className="animate-fade-in">
          <TeamRoster agents={team.roster as any} />
        </div>
      ) : (
        <div className="animate-fade-in flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.06] py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03]">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="mt-4 text-[15px] font-semibold text-text-secondary">
            No agents yet
          </h3>
          <p className="mt-1 text-[13px] text-text-muted">
            This team hasn&apos;t added any agents from the marketplace
          </p>
          <Link
            href="/marketplace"
            className="group relative mt-5 overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-5 py-[8px] text-[13px] font-semibold text-white shadow-[0_0_16px_rgba(139,92,246,0.15)] transition-all duration-300 hover:shadow-[0_0_24px_rgba(139,92,246,0.25)] hover:brightness-110"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
            <span className="relative">Browse Marketplace</span>
          </Link>
        </div>
      )}

      {/* Footer CTA */}
      <div className="mt-14 text-center">
        <p className="text-[13px] text-text-muted">
          Powered by{" "}
          <Link href="/teams" className="text-purple-400/80 transition-colors duration-200 hover:text-purple-400">
            OrderlyAgents
          </Link>{" "}
          —{" "}
          <Link
            href="/marketplace"
            className="text-purple-400/80 transition-colors duration-200 hover:text-purple-400"
          >
            Browse the full marketplace
          </Link>
        </p>
      </div>
    </div>
  );
}
