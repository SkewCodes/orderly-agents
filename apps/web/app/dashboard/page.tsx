"use client";

import { useState } from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/use-wallet";
import { cn } from "@/lib/utils/cn";
import { truncateAddress } from "@/lib/utils/format";
import { AnimatedNumber } from "@/components/shared/animated-number";

/* ------------------------------------------------------------------ */
/*  Mock data                                                         */
/* ------------------------------------------------------------------ */

const isPublisher = true;

const stats = [
  { label: "Agents Installed", value: 7, prefix: "" },
  { label: "Agents Starred", value: 12, prefix: "" },
  { label: "Active Agents", value: 5, prefix: "" },
  { label: "Total Saved", value: 2340, prefix: "$" },
];

type ActivityKind = "install" | "star" | "config";

const recentActivity: {
  kind: ActivityKind;
  description: string;
  time: string;
}[] = [
  { kind: "install", description: "Installed DEX Vibe Coder", time: "2 hours ago" },
  { kind: "star", description: "Starred Alert Engine", time: "5 hours ago" },
  { kind: "config", description: "Updated Portfolio Rebalancer config", time: "1 day ago" },
  { kind: "install", description: "Installed Orderbook Analyst", time: "2 days ago" },
  { kind: "star", description: "Starred Graduation Sniper", time: "3 days ago" },
];

const installedAgents = [
  { emoji: "✨", name: "DEX Vibe Coder", publisher: "Starchild Labs", status: "active" as const, lastUsed: "2 hours ago" },
  { emoji: "📊", name: "Orderbook Analyst", publisher: "Orderly Core", status: "active" as const, lastUsed: "1 hour ago" },
  { emoji: "⚡", name: "Fee Optimizer", publisher: "Orderly Core", status: "active" as const, lastUsed: "4 hours ago" },
  { emoji: "⚖️", name: "Portfolio Rebalancer", publisher: "PerpWizard", status: "paused" as const, lastUsed: "3 days ago" },
];

const starredAgents = [
  { emoji: "✨", name: "DEX Vibe Coder", description: "AI-powered trading companion for Orderly DEX", stars: 342 },
  { emoji: "🔔", name: "Alert Engine", description: "Real-time notifications for price movements and events", stars: 218 },
  { emoji: "⚡", name: "Fee Optimizer", description: "Intelligent fee tier selection for lower trading costs", stars: 189 },
  { emoji: "🎯", name: "Graduation Sniper", description: "Automated graduation event detection and execution", stars: 156 },
  { emoji: "📊", name: "Orderbook Analyst", description: "Deep orderbook analysis with spread and depth insights", stars: 274 },
];

const publishedAgents = [
  { emoji: "🤖", name: "Auto-Compounder", status: "approved" as const, installs: 840 },
  { emoji: "📈", name: "Trend Follower", status: "pending" as const, installs: 0 },
  { emoji: "🧪", name: "Strategy Backtester", status: "draft" as const, installs: 0 },
];

/* ------------------------------------------------------------------ */
/*  Icons                                                             */
/* ------------------------------------------------------------------ */

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

function StarIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return filled ? (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" />
    </svg>
  ) : (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
    </svg>
  );
}

const activityIcons: Record<ActivityKind, (cls: string) => React.ReactNode> = {
  install: (cls) => <DownloadIcon className={cls} />,
  star: (cls) => <StarIcon className={cls} />,
  config: (cls) => <SettingsIcon className={cls} />,
};

/* ------------------------------------------------------------------ */
/*  Tabs                                                              */
/* ------------------------------------------------------------------ */

const baseTabs = ["Overview", "Installed", "Starred"] as const;
const allTabs = [...baseTabs, "Published"] as const;
type Tab = (typeof allTabs)[number];

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

const DEMO_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18";

export default function DashboardPage() {
  const { address, isAuthenticated } = useWallet();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const tabs: readonly Tab[] = isPublisher ? allTabs : baseTabs;
  const displayAddress = isAuthenticated ? address : DEMO_ADDRESS;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-[28px] font-bold tracking-[-0.02em] text-text-primary">
          Dashboard
        </h1>
        <p className="mt-1 font-mono text-[14px] text-text-muted">
          {truncateAddress(displayAddress ?? DEMO_ADDRESS)}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mt-8 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-full px-4 py-[7px] text-[13px] font-medium transition-all duration-200",
              activeTab === tab
                ? "bg-white/[0.06] text-text-primary shadow-[inset_0_0.5px_0_rgba(255,255,255,0.06)]"
                : "text-text-muted hover:text-text-secondary hover:bg-white/[0.03]"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-8 animate-fade-in">
        {activeTab === "Overview" && <OverviewTab address={displayAddress ?? DEMO_ADDRESS} />}
        {activeTab === "Installed" && <InstalledTab />}
        {activeTab === "Starred" && <StarredTab />}
        {activeTab === "Published" && <PublishedTab />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Overview Tab                                                      */
/* ------------------------------------------------------------------ */

function OverviewTab({ address }: { address: string | undefined }) {
  return (
    <div className="space-y-8 stagger-children">
      {/* Welcome */}
      <p className="text-[16px] text-text-secondary">
        Welcome back,{" "}
        <span className="font-mono text-text-primary">
          {address ? truncateAddress(address) : "anon"}
        </span>
      </p>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="glass-card rounded-2xl px-6 py-5"
          >
            <p className="text-[12px] font-medium uppercase tracking-wide text-text-muted">
              {s.label}
            </p>
            <p className="mt-2 text-[28px] font-bold tracking-tight text-text-primary">
              {s.prefix}
              <AnimatedNumber value={s.value} />
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-[16px] font-semibold text-text-primary">
          Recent Activity
        </h2>
        <div className="mt-4 space-y-2">
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className="glass-card flex items-center gap-4 rounded-2xl px-5 py-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
                {activityIcons[item.kind]("h-4 w-4 text-text-muted")}
              </div>
              <p className="flex-1 text-[14px] text-text-secondary">
                {item.description}
              </p>
              <span className="shrink-0 text-[12px] text-text-muted">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Installed Tab                                                     */
/* ------------------------------------------------------------------ */

function InstalledTab() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {installedAgents.map((agent) => (
        <div key={agent.name} className="glass-card rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/[0.12] to-purple-900/[0.08] text-lg shadow-[inset_0_0.5px_0_rgba(255,255,255,0.06)]">
                {agent.emoji}
              </span>
              <div>
                <p className="text-[14px] font-semibold text-text-primary">
                  {agent.name}
                </p>
                <p className="text-[12px] text-text-muted">
                  {agent.publisher}
                </p>
              </div>
            </div>

            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[11px] font-medium",
                agent.status === "active"
                  ? "bg-emerald-500/[0.08] text-emerald-400"
                  : "bg-white/[0.04] text-text-muted"
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  agent.status === "active" ? "bg-emerald-400" : "bg-text-muted"
                )}
              />
              {agent.status === "active" ? "Active" : "Paused"}
            </span>
          </div>

          <p className="mt-4 text-[12px] text-text-muted">
            Last used: {agent.lastUsed}
          </p>

          <div className="mt-4 flex gap-2">
            <button className="flex-1 rounded-full border border-white/[0.06] py-[7px] text-[12px] font-medium text-text-secondary transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.03]">
              Configure
            </button>
            <button className="flex-1 rounded-full border border-white/[0.06] py-[7px] text-[12px] font-medium text-text-secondary transition-all duration-200 hover:border-red-500/20 hover:text-red-400 hover:bg-red-500/[0.04]">
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Starred Tab                                                       */
/* ------------------------------------------------------------------ */

function StarredTab() {
  return (
    <div className="space-y-2">
      {starredAgents.map((agent) => (
        <div
          key={agent.name}
          className="glass-card flex items-center gap-4 rounded-2xl px-5 py-4"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/[0.12] to-purple-900/[0.08] text-base shadow-[inset_0_0.5px_0_rgba(255,255,255,0.06)]">
            {agent.emoji}
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-text-primary">
              {agent.name}
            </p>
            <p className="mt-0.5 truncate text-[13px] text-text-muted">
              {agent.description}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[12px] tabular-nums text-text-muted">
              <StarIcon className="h-3.5 w-3.5" />
              {agent.stars}
            </span>
            <button className="group rounded-lg p-1.5 transition-colors hover:bg-amber-500/[0.08]">
              <StarIcon
                className="h-4.5 w-4.5 text-amber-400 transition-transform group-hover:scale-110"
                filled
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Published Tab                                                     */
/* ------------------------------------------------------------------ */

const statusStyles = {
  approved: "bg-emerald-500/[0.08] text-emerald-400",
  pending: "bg-amber-500/[0.08] text-amber-400",
  draft: "bg-white/[0.04] text-text-muted",
} as const;

const statusLabels = {
  approved: "Approved",
  pending: "Pending Review",
  draft: "Draft",
} as const;

function PublishedTab() {
  return (
    <div className="space-y-6">
      {/* Publisher Card */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/[0.12] to-purple-900/[0.08] text-xl shadow-[inset_0_0.5px_0_rgba(255,255,255,0.06)]">
            🏢
          </div>
          <div>
            <p className="text-[16px] font-semibold text-text-primary">
              Your Studio
            </p>
            <p className="mt-0.5 text-[13px] text-text-muted">
              {publishedAgents.length} agents published · 1,240 total installs
            </p>
          </div>
        </div>
      </div>

      {/* Published Agent List */}
      <div className="space-y-2">
        {publishedAgents.map((agent) => (
          <div
            key={agent.name}
            className="glass-card flex items-center gap-4 rounded-2xl px-5 py-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/[0.12] to-purple-900/[0.08] text-base shadow-[inset_0_0.5px_0_rgba(255,255,255,0.06)]">
              {agent.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold text-text-primary">
                {agent.name}
              </p>
              {agent.installs > 0 && (
                <p className="mt-0.5 text-[12px] text-text-muted">
                  {agent.installs.toLocaleString()} installs
                </p>
              )}
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-[3px] text-[11px] font-medium",
                statusStyles[agent.status]
              )}
            >
              {statusLabels[agent.status]}
            </span>
          </div>
        ))}
      </div>

      {/* Publish New Agent */}
      <Link
        href="/publish"
        className="group relative inline-flex overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-[9px] text-[13px] font-semibold text-white shadow-[0_0_16px_rgba(139,92,246,0.15)] transition-all duration-300 hover:shadow-[0_0_24px_rgba(139,92,246,0.25)] hover:brightness-110"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
        <span className="relative">Publish New Agent</span>
      </Link>
    </div>
  );
}
