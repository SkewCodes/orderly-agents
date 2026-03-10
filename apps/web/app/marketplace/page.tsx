"use client";

import { useState, useMemo } from "react";
import { AgentGrid } from "@/components/agents/agent-grid";
import { DivisionFilter } from "@/components/agents/division-filter";
import { SearchBar } from "@/components/shared/search-bar";
import { useAgentList, useAgentStats } from "@/hooks/use-agents";
import { getMockAgentCards, getMockStats } from "@/lib/mock-data";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { cn } from "@/lib/utils/cn";

const sortOptions = [
  { value: "trending", label: "Trending" },
  { value: "stars", label: "Most Stars" },
  { value: "installs", label: "Most Installs" },
  { value: "newest", label: "Newest" },
] as const;

const allMockAgents = getMockAgentCards();
const fallbackStats = getMockStats();

export default function MarketplacePage() {
  const [division, setDivision] = useState("all");
  const [runtime] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("trending");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAgentList({
    division,
    runtime,
    search,
    sortBy,
    page,
  });
  const { data: stats } = useAgentStats();

  const useMock = isError || (!isLoading && !data?.items?.length && !search);

  const displayAgents = useMemo(() => {
    if (!useMock) return data?.items ?? [];
    let filtered = [...allMockAgents];
    if (division !== "all") filtered = filtered.filter((a) => a.division === division);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (sortBy === "stars") filtered.sort((a, b) => (b.starCount ?? 0) - (a.starCount ?? 0));
    else if (sortBy === "installs") filtered.sort((a, b) => (b.installCount ?? 0) - (a.installCount ?? 0));
    return filtered;
  }, [useMock, data, division, search, sortBy]);

  const displayStats = stats ?? (useMock ? fallbackStats : null);

  return (
    <div className="relative">
      {/* Hero area */}
      <section className="hero-glow relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 pb-8 pt-14 sm:px-6 sm:pt-16 lg:px-8">
          <div className="animate-fade-in-up">
            <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-[-0.03em]">
              Agent <span className="gradient-text">Marketplace</span>
            </h1>
            <p className="mt-2 text-[15px] text-text-secondary">
              Discover AI agents built for the Orderly ecosystem
            </p>
          </div>

          {/* Stats Bar */}
          {displayStats && (
            <div className="stagger-children mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Total Agents", value: displayStats.totalAgents },
                { label: "Total Installs", value: displayStats.totalInstalls },
                { label: "Active Teams", value: displayStats.activeTeams },
                { label: "Contributors", value: displayStats.contributors },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card rounded-xl px-4 py-3.5"
                >
                  <AnimatedNumber
                    value={stat.value}
                    className="block text-[20px] font-semibold tracking-[-0.02em] text-text-primary"
                  />
                  <p className="mt-0.5 text-[12px] text-text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Search + Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full max-w-md">
              <SearchBar
                value={search}
                onChange={(v) => {
                  setSearch(v);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex items-center gap-1">
              {sortOptions.map((opt) => {
                const isActive = sortBy === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value);
                      setPage(1);
                    }}
                    className={cn(
                      "relative rounded-full px-3.5 py-[6px] text-[12px] font-medium transition-all duration-300",
                      isActive
                        ? "text-white"
                        : "text-text-muted hover:text-text-secondary"
                    )}
                  >
                    {isActive && (
                      <span className="absolute inset-0 rounded-full bg-white/[0.06] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.08)]" />
                    )}
                    <span className="relative">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <DivisionFilter
            value={division}
            onChange={(v) => {
              setDivision(v);
              setPage(1);
            }}
          />
        </div>

        {/* Grid */}
        {isLoading && !useMock ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="relative h-56 overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.015]"
              >
                <div className="absolute inset-0 animate-shimmer" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="stagger-children">
              <AgentGrid agents={displayAgents} />
            </div>

            {/* Pagination (only for real data) */}
            {!useMock && data && data.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-full border border-white/[0.06] bg-white/[0.02] px-5 py-2 text-[13px] font-medium text-text-secondary transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.04] disabled:opacity-30 disabled:pointer-events-none"
                >
                  Previous
                </button>
                <span className="px-3 text-[13px] tabular-nums text-text-muted">
                  {page} / {data.totalPages}
                </span>
                <button
                  disabled={page >= data.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="rounded-full border border-white/[0.06] bg-white/[0.02] px-5 py-2 text-[13px] font-medium text-text-secondary transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.04] disabled:opacity-30 disabled:pointer-events-none"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!isLoading && displayAgents.length === 0 && (
          <div className="animate-fade-in py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03]">
              <svg className="h-7 w-7 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-[15px] font-medium text-text-secondary">
              No agents found
            </p>
            <p className="mt-1 text-[13px] text-text-muted">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        <div className="h-16" />
      </div>
    </div>
  );
}
