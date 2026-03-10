import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { AnimatedNumber } from "@/components/shared/animated-number";

const featuredAgents = [
  { emoji: "✨", name: "DEX Vibe Coder", desc: "AI pair programmer for Orderly SDK patterns", runtime: "Skill", stars: "2.1K", installs: "5.6K", href: "/marketplace/dex-vibe-coder" },
  { emoji: "📊", name: "Orderbook Analyst", desc: "Real-time depth analysis and whale detection", runtime: "MCP", stars: "1.2K", installs: "3.8K", href: "/marketplace/orderbook-analyst" },
  { emoji: "🔔", name: "Alert Engine", desc: "Price, volume, and on-chain event alerts", runtime: "MCP", stars: "1.8K", installs: "5.1K", href: "/marketplace/alert-engine" },
  { emoji: "⚡", name: "Fee Optimizer", desc: "Smart order routing to minimize fees", runtime: "Skill", stars: "1.5K", installs: "4.2K", href: "/marketplace/fee-optimizer" },
  { emoji: "🎯", name: "Graduation Sniper", desc: "Instant trades on bonding curve graduations", runtime: "Skill", stars: "847", installs: "2.3K", href: "/marketplace/graduation-sniper" },
  { emoji: "🔍", name: "Contract Auditor", desc: "AI-powered Solidity analysis and optimization", runtime: "Skill", stars: "934", installs: "2.1K", href: "/marketplace/smart-contract-auditor" },
];

const stats = [
  { value: 13, label: "Agents" },
  { value: 35700, label: "Installs" },
  { value: 3, label: "Teams" },
  { value: 8, label: "Publishers" },
];

const steps = [
  {
    number: "01",
    title: "Discover",
    desc: "Browse agents built for Orderly DEXes",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Install",
    desc: "One-click setup with Skill files or MCP servers",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Deploy",
    desc: "Run agents on your favorite Orderly-powered DEX",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      </svg>
    ),
  },
];

const runtimes = [
  {
    title: "Skill",
    desc: "Download a SKILL.md file. Drop it into Claude, Cursor, or any LLM.",
    comingSoon: false,
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    title: "MCP Server",
    desc: "Connect to a live data source via Model Context Protocol.",
    comingSoon: false,
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
    ),
  },
  {
    title: "Hosted",
    desc: "Autonomous agents that execute strategies server-side.",
    comingSoon: true,
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 0 0-.12-1.03l-2.268-9.64a3.375 3.375 0 0 0-3.285-2.602H7.923a3.375 3.375 0 0 0-3.285 2.602l-2.268 9.64a4.5 4.5 0 0 0-.12 1.03v.228m19.5 0a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3m19.5 0a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3m16.5 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Z" />
      </svg>
    ),
  },
];

const ecosystem = [
  { name: "WOOFi Pro", initial: "W", tier: "Diamond", tierColor: "text-tier-diamond", bgColor: "bg-tier-diamond/10 border-tier-diamond/20", tagline: "Institutional-grade perpetual trading" },
  { name: "LogX Network", initial: "L", tier: "Platinum", tierColor: "text-tier-platinum", bgColor: "bg-tier-platinum/10 border-tier-platinum/20", tagline: "Cross-chain derivatives aggregation" },
  { name: "Elixir DEX", initial: "E", tier: "Gold", tierColor: "text-tier-gold", bgColor: "bg-tier-gold/10 border-tier-gold/20", tagline: "Decentralized market-making network" },
];

export default function Home() {
  return (
    <div className="relative">
      {/* ─── Hero ────────────────────────────────────────── */}
      <section className="hero-glow relative pt-20 pb-28 sm:pt-28 sm:pb-36">
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="animate-fade-in mb-8">
              <span className="animate-shimmer inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5 text-sm font-medium text-text-secondary">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-purple-400" />
                The AI Layer for DeFi
              </span>
            </div>

            {/* Headline */}
            <h1
              className="animate-fade-in-up max-w-4xl font-bold tracking-[-0.03em] leading-[1.05]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              Build <span className="gradient-text">smarter</span>.
              <br />
              Trade <span className="gradient-text">faster</span>.
            </h1>

            {/* Subtitle */}
            <p
              className="animate-fade-in-up mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl"
              style={{ animationDelay: "100ms" }}
            >
              The open marketplace for AI agents on Orderly Network.
              Discover, install, and deploy trading automation in seconds.
            </p>

            {/* CTAs */}
            <div
              className="animate-fade-in-up mt-10 flex flex-col gap-4 sm:flex-row"
              style={{ animationDelay: "200ms" }}
            >
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:brightness-110"
              >
                Explore Marketplace
              </Link>
              <Link
                href="/publish"
                className="inline-flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-text-primary transition-all hover:bg-white/[0.06]"
              >
                Start Building
              </Link>
            </div>

            {/* Stats */}
            <div
              className="stagger-children mt-16 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
              style={{ animationDelay: "350ms" }}
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card flex flex-col items-center rounded-2xl px-5 py-5"
                >
                  <span className="text-2xl font-bold tracking-[-0.02em] text-text-primary sm:text-3xl">
                    <AnimatedNumber value={stat.value} />
                  </span>
                  <span className="mt-1 text-sm text-text-muted">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ───────────────────────────────── */}
      <section className="relative py-28 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up text-center">
            <h2
              className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
            >
              Three steps to <span className="gradient-text">smarter trading</span>
            </h2>
          </div>

          <div className="stagger-children mt-16 grid gap-6 sm:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className={cn(
                  "glass-card card-hover group relative rounded-2xl p-8",
                )}
              >
                <div className="mb-6 flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-sm font-bold text-purple-400">
                    {step.number}
                  </span>
                  <span className="text-purple-400">{step.icon}</span>
                </div>
                <h3 className="text-xl font-semibold tracking-[-0.02em]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Agents ────────────────────────────── */}
      <section className="relative py-28 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up flex items-end justify-between">
            <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              Featured agents
            </h2>
            <Link
              href="/marketplace"
              className="hidden text-sm font-medium text-text-secondary transition-colors hover:text-text-primary sm:inline-flex sm:items-center sm:gap-1"
            >
              View all
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="stagger-children mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredAgents.map((agent) => (
              <Link
                key={agent.name}
                href={agent.href}
                className={cn(
                  "glass-card card-hover card-grid-item group rounded-2xl p-6 transition-colors",
                )}
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-2xl">
                    {agent.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-base font-semibold tracking-[-0.02em]">
                        {agent.name}
                      </h3>
                      <span
                        className={cn(
                          "shrink-0 rounded-md px-2 py-0.5 text-xs font-medium",
                          agent.runtime === "Skill"
                            ? "bg-runtime-skill/15 text-purple-300"
                            : "bg-runtime-mcp/15 text-purple-200"
                        )}
                      >
                        {agent.runtime}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                      {agent.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-4 border-t border-white/[0.04] pt-4 text-xs text-text-muted">
                  <span className="inline-flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                    {agent.stars}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    {agent.installs}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              View all agents
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Runtime Tiers ──────────────────────────────── */}
      <section className="relative py-28 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up text-center">
            <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              Built for <span className="gradient-text">every runtime</span>
            </h2>
          </div>

          <div className="stagger-children mt-16 grid gap-6 sm:grid-cols-3">
            {runtimes.map((rt) => (
              <div
                key={rt.title}
                className={cn(
                  "glass-card card-hover relative rounded-2xl p-8",
                  rt.comingSoon && "opacity-50",
                )}
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                    {rt.icon}
                  </span>
                  {rt.comingSoon && (
                    <span className="rounded-md bg-white/[0.05] px-2 py-0.5 text-xs font-medium text-text-muted">
                      Coming soon
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold tracking-[-0.02em]">
                  {rt.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {rt.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Ecosystem ──────────────────────────────────── */}
      <section className="relative py-28 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up text-center">
            <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              Trusted by the <span className="gradient-text">Orderly ecosystem</span>
            </h2>
          </div>

          <div className="stagger-children mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-3">
            {ecosystem.map((team) => (
              <div
                key={team.name}
                className="glass-card card-hover flex flex-col items-center rounded-2xl p-8 text-center"
              >
                <span
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl font-bold",
                    team.bgColor,
                    team.tierColor,
                  )}
                >
                  {team.initial}
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em]">
                  {team.name}
                </h3>
                <span
                  className={cn(
                    "mt-2 text-xs font-semibold uppercase tracking-widest",
                    team.tierColor,
                  )}
                >
                  {team.tier}
                </span>
                <p className="mt-2 text-sm text-text-muted">{team.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─────────────────────────────────── */}
      <section className="hero-glow relative py-28 sm:py-36">
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up flex flex-col items-center text-center">
            <h2
              className="max-w-3xl text-3xl font-bold tracking-[-0.03em] sm:text-5xl"
            >
              Ready to build the future of{" "}
              <span className="gradient-text">DeFi</span>?
            </h2>
            <p className="mt-5 max-w-xl text-lg text-text-secondary">
              Join the growing ecosystem of AI-powered trading agents.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:brightness-110"
              >
                Browse Marketplace
              </Link>
              <Link
                href="/publish"
                className="inline-flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-text-primary transition-all hover:bg-white/[0.06]"
              >
                Publish Your Agent
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
