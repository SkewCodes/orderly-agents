import { Suspense } from "react";
import Link from "next/link";
import { serverCaller } from "@/lib/trpc/server";
import { TeamCard, CTATeamCard } from "@/components/teams/team-card";
import { mockTeams } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Agent Teams",
  description:
    "Discover AI agent teams powering every Orderly-powered DEX. See which capabilities each exchange has assembled.",
};

async function TeamsGrid() {
  let teams;
  try {
    const caller = await serverCaller();
    teams = await caller.teams.list({ tier: "all", page: 1, limit: 20 });
  } catch {
    teams = mockTeams;
  }

  return (
    <div className="stagger-children grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
      <CTATeamCard />
    </div>
  );
}

const ecosystemPartners = [
  {
    name: "Starchild AI",
    description: "Vibe-coding agents for DEX builders",
    agentCount: 3,
    icon: "✦",
  },
  {
    name: "WOO Network",
    description: "Institutional-grade liquidity agents",
    agentCount: 2,
    icon: "◈",
  },
  {
    name: "Orderly Core",
    description: "Protocol-level infrastructure agents",
    agentCount: 2,
    icon: "⬡",
  },
  {
    name: "Community",
    description: "Open-source agents by independent builders",
    agentCount: 6,
    icon: "○",
  },
];

export default function TeamsPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="hero-glow relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
          <div className="relative mx-auto max-w-3xl text-center">
            <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5 text-[13px] text-text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
              Powered by Orderly Network
            </div>
            <h1
              className="animate-fade-in-up text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.03em]"
              style={{ animationDelay: "100ms" }}
            >
              The <span className="gradient-text">AI layer</span> for every
              <br />
              Orderly-powered DEX
            </h1>
            <p
              className="animate-fade-in-up mx-auto mt-5 max-w-xl text-[16px] leading-[1.7] text-text-secondary"
              style={{ animationDelay: "200ms" }}
            >
              Every DEX curates a team of AI agents from the marketplace.
              Browse teams, discover capabilities, and find the best exchange
              for your strategy.
            </p>
            <div
              className="animate-fade-in-up mt-8 flex items-center justify-center gap-3"
              style={{ animationDelay: "300ms" }}
            >
              <Link
                href="/marketplace"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-[9px] text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.2),0_1px_2px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:brightness-110"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
                <span className="relative">Explore Marketplace</span>
              </Link>
              <Link
                href="/teams/create"
                className="rounded-full border border-white/[0.06] px-6 py-[9px] text-[13px] font-medium text-text-secondary transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.03]"
              >
                Create Team
              </Link>
              <Link
                href="/publish"
                className="rounded-full border border-white/[0.06] px-6 py-[9px] text-[13px] font-medium text-text-secondary transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.03]"
              >
                Publish Agent
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Teams Grid */}
      <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-shimmer rounded-2xl border border-white/[0.04] bg-white/[0.015]"
                />
              ))}
            </div>
          }
        >
          <TeamsGrid />
        </Suspense>
      </section>

      {/* Ecosystem Partners */}
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-text-muted">
            Ecosystem
          </p>
          <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-text-primary">
            Built by the best in DeFi
          </h2>
        </div>
        <div className="stagger-children mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ecosystemPartners.map((partner) => (
            <div
              key={partner.name}
              className="glass-card group rounded-2xl p-5 transition-all duration-300 hover:bg-white/[0.025]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/[0.08] text-purple-400 text-[14px]">
                  {partner.icon}
                </span>
                <h3 className="text-[14px] font-semibold text-text-primary">
                  {partner.name}
                </h3>
              </div>
              <p className="mt-2.5 text-[13px] leading-[1.6] text-text-muted">
                {partner.description}
              </p>
              <p className="mt-3 text-[13px] font-medium text-purple-400">
                {partner.agentCount} agents
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
