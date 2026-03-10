"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useWallet } from "@/hooks/use-wallet";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { cn } from "@/lib/utils/cn";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[13px] text-text-primary placeholder-text-muted outline-none transition-all duration-300 focus:border-purple-500/30 focus:bg-white/[0.03]";

const presetColors = [
  "#1E40AF",
  "#7C3AED",
  "#059669",
  "#DC2626",
  "#D97706",
  "#0891B2",
  "#BE185D",
  "#4338CA",
];

const mockTeam = {
  name: "WOOFi Pro",
  slug: "woofi-pro",
  tagline: "Institutional-grade trading on WOO's flagship DEX",
  color: "#1E40AF",
  websiteUrl: "https://fi.woo.org",
  memberCount: 12400,
  agentCount: 5,
};

const mockAgents = [
  { id: "1", emoji: "📊", name: "Orderbook Analyst", featured: true },
  { id: "2", emoji: "⚡", name: "Fee Optimizer", featured: true },
  { id: "3", emoji: "🌊", name: "WOO Liquidity Bridge", featured: false },
  { id: "4", emoji: "📡", name: "Social Sentinel", featured: false },
  { id: "5", emoji: "🔔", name: "Alert Engine", featured: false },
];

const availableAgents = [
  { id: "a1", emoji: "✨", name: "DEX Vibe Coder" },
  { id: "a2", emoji: "🎯", name: "Graduation Sniper" },
  { id: "a3", emoji: "⚖️", name: "Portfolio Rebalancer" },
];

type Tab = "general" | "roster" | "members";

const tabs: { id: Tab; label: string; comingSoon?: boolean }[] = [
  { id: "general", label: "General" },
  { id: "roster", label: "Agent Roster" },
  { id: "members", label: "Members", comingSoon: true },
];

export default function TeamSettingsPage() {
  const params = useParams();
  const { isAuthenticated, signIn } = useWallet();
  const [activeTab, setActiveTab] = useState<Tab>("general");

  const [name, setName] = useState(mockTeam.name);
  const [slug, setSlug] = useState(mockTeam.slug);
  const [tagline, setTagline] = useState(mockTeam.tagline);
  const [websiteUrl, setWebsiteUrl] = useState(mockTeam.websiteUrl);
  const [color, setColor] = useState(mockTeam.color);
  const [saved, setSaved] = useState(false);

  const [agents, setAgents] = useState(mockAgents);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [addSearch, setAddSearch] = useState("");
  const [addedId, setAddedId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowAddDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="hero-glow relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="animate-fade-in-up relative text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500/[0.12] to-purple-900/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_40px_rgba(0,0,0,0.3)]">
            <svg
              className="h-8 w-8 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-[24px] font-bold tracking-[-0.02em] text-text-primary">
            Connect Your Wallet
          </h1>
          <p className="mt-2 text-[15px] text-text-secondary">
            Connect your wallet to manage team settings
          </p>
          <button
            onClick={signIn}
            className="group relative mt-6 overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-7 py-3 text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.2),0_1px_2px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:brightness-110"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
            <span className="relative">Connect Wallet</span>
          </button>
        </div>
      </div>
    );
  }

  const filteredAvailable = availableAgents.filter(
    (a) =>
      a.name.toLowerCase().includes(addSearch.toLowerCase()) &&
      !agents.find((existing) => existing.name === a.name)
  );

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleFeatured(id: string) {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, featured: !a.featured } : a))
    );
  }

  function removeAgent(id: string) {
    setAgents((prev) => prev.filter((a) => a.id !== id));
  }

  function addAgent(agent: (typeof availableAgents)[number]) {
    setAgents((prev) => [
      ...prev,
      { id: agent.id, emoji: agent.emoji, name: agent.name, featured: false },
    ]);
    setAddedId(agent.id);
    setTimeout(() => setAddedId(null), 1500);
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Teams", href: "/teams" },
          { label: mockTeam.name, href: `/teams/${params.teamId}` },
          { label: "Settings" },
        ]}
      />

      <div className="animate-fade-in">
        <h1 className="text-[24px] font-bold tracking-[-0.02em] text-text-primary">
          Team Settings
        </h1>
        <p className="mt-1.5 text-[15px] text-text-secondary">
          Manage your team profile, agent roster, and members
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <nav className="shrink-0 lg:w-52">
          <div className="flex gap-1 lg:flex-col">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.comingSoon && setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-left text-[13px] font-medium transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-purple-500/[0.1] text-purple-400"
                    : tab.comingSoon
                      ? "text-text-muted/40 cursor-not-allowed"
                      : "text-text-muted hover:bg-white/[0.03] hover:text-text-secondary"
                )}
                disabled={tab.comingSoon}
              >
                {tab.label}
                {tab.comingSoon && (
                  <span className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-text-muted/50">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {activeTab === "general" && (
            <div className="animate-fade-in glass-card rounded-2xl p-6 space-y-6">
              <div>
                <label className="block text-[12px] font-medium text-text-muted">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="WOOFi Pro"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-text-muted">
                  Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")
                    )
                  }
                  className={cn(inputClass, "font-mono")}
                  placeholder="woofi-pro"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-text-muted">
                  Tagline{" "}
                  <span className="text-text-muted/50">(optional)</span>
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className={inputClass}
                  placeholder="Institutional-grade trading..."
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-text-muted">
                  Website URL{" "}
                  <span className="text-text-muted/50">(optional)</span>
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className={inputClass}
                  placeholder="https://fi.woo.org"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-text-muted">
                  Brand Color
                </label>
                <div className="mt-3 flex items-center gap-3">
                  {presetColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={cn(
                        "h-8 w-8 rounded-full transition-all duration-200",
                        color === c
                          ? "ring-2 ring-white/60 ring-offset-2 ring-offset-[#0C0A1A] scale-110"
                          : "hover:scale-105 opacity-70 hover:opacity-100"
                      )}
                      style={{ backgroundColor: c }}
                      aria-label={`Select color ${c}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSave}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-2.5 text-[13px] font-semibold text-white shadow-[0_0_16px_rgba(139,92,246,0.15)] transition-all duration-300 hover:shadow-[0_0_24px_rgba(139,92,246,0.25)] hover:brightness-110"
                >
                  <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                  <span className="relative">Save Changes</span>
                </button>
                {saved && (
                  <span className="animate-fade-in text-[13px] font-medium text-emerald-400">
                    Saved!
                  </span>
                )}
              </div>
            </div>
          )}

          {activeTab === "roster" && (
            <div className="animate-fade-in space-y-4">
              <div className="glass-card rounded-2xl divide-y divide-white/[0.04]">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-white/[0.015]"
                  >
                    {/* Drag handle */}
                    <svg
                      className="h-4 w-4 shrink-0 text-text-muted/30 cursor-grab"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01" />
                    </svg>

                    <span className="text-[18px]">{agent.emoji}</span>
                    <span className="flex-1 text-[14px] font-medium text-text-primary">
                      {agent.name}
                    </span>

                    {/* Featured toggle */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-text-muted">
                        Featured
                      </span>
                      <button
                        onClick={() => toggleFeatured(agent.id)}
                        className={cn(
                          "relative h-5 w-9 rounded-full transition-colors duration-200",
                          agent.featured
                            ? "bg-purple-600"
                            : "bg-white/[0.08]"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                            agent.featured
                              ? "translate-x-[18px]"
                              : "translate-x-0.5"
                          )}
                        />
                      </button>
                    </div>

                    <button
                      onClick={() => removeAgent(agent.id)}
                      className="rounded-lg px-3 py-1.5 text-[12px] font-medium text-red-400/70 transition-all duration-200 hover:bg-red-500/[0.08] hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Agent */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowAddDropdown(!showAddDropdown)}
                  className="flex items-center gap-2 rounded-xl border border-dashed border-white/[0.08] px-5 py-3 text-[13px] font-medium text-text-muted transition-all duration-200 hover:border-purple-500/20 hover:bg-white/[0.02] hover:text-purple-400"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add Agent
                </button>

                {showAddDropdown && (
                  <div className="animate-fade-in absolute left-0 top-full z-10 mt-2 w-80 glass-card rounded-2xl p-3 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
                    <input
                      type="text"
                      value={addSearch}
                      onChange={(e) => setAddSearch(e.target.value)}
                      className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[13px] text-text-primary placeholder-text-muted outline-none focus:border-purple-500/30"
                      placeholder="Search agents..."
                      autoFocus
                    />
                    <div className="mt-2 space-y-1">
                      {filteredAvailable.length === 0 ? (
                        <p className="px-3 py-4 text-center text-[13px] text-text-muted">
                          No agents available
                        </p>
                      ) : (
                        filteredAvailable.map((agent) => (
                          <div
                            key={agent.id}
                            className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-white/[0.03]"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="text-[16px]">
                                {agent.emoji}
                              </span>
                              <span className="text-[13px] font-medium text-text-primary">
                                {agent.name}
                              </span>
                            </div>
                            {addedId === agent.id ? (
                              <span className="text-[12px] font-medium text-emerald-400">
                                Added!
                              </span>
                            ) : (
                              <button
                                onClick={() => addAgent(agent)}
                                className="rounded-lg bg-purple-600/[0.15] px-3 py-1 text-[12px] font-medium text-purple-400 transition-all duration-200 hover:bg-purple-600/[0.25]"
                              >
                                Add
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "members" && (
            <div className="animate-fade-in glass-card flex flex-col items-center justify-center rounded-2xl py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03]">
                <svg
                  className="h-7 w-7 text-text-muted/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <h3 className="mt-5 text-[16px] font-semibold text-text-secondary">
                Coming Soon
              </h3>
              <p className="mt-2 max-w-xs text-[13px] leading-[1.7] text-text-muted">
                Invite team members and manage permissions. This feature is in
                development.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
