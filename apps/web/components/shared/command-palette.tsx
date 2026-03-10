"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";

interface CommandItem {
  name: string;
  href: string;
  category: string;
  emoji?: string;
}

const PAGES: CommandItem[] = [
  { name: "Home", href: "/", category: "Pages", emoji: "🏠" },
  { name: "Marketplace", href: "/marketplace", category: "Pages", emoji: "📦" },
  { name: "Teams", href: "/teams", category: "Pages", emoji: "👥" },
  { name: "Publish Agent", href: "/publish", category: "Pages", emoji: "➕" },
  { name: "Dashboard", href: "/dashboard", category: "Pages", emoji: "📊" },
  { name: "Documentation", href: "/docs", category: "Pages", emoji: "📖" },
];

const AGENTS: CommandItem[] = [
  { name: "DEX Vibe Coder", href: "/marketplace/dex-vibe-coder", category: "Agents", emoji: "✨" },
  { name: "Orderbook Analyst", href: "/marketplace/orderbook-analyst", category: "Agents", emoji: "📊" },
  { name: "Alert Engine", href: "/marketplace/alert-engine", category: "Agents", emoji: "🔔" },
  { name: "Fee Optimizer", href: "/marketplace/fee-optimizer", category: "Agents", emoji: "⚡" },
  { name: "Graduation Sniper", href: "/marketplace/graduation-sniper", category: "Agents", emoji: "🎯" },
  { name: "Social Sentinel", href: "/marketplace/social-sentiment", category: "Agents", emoji: "📡" },
  { name: "UI Kit Generator", href: "/marketplace/ui-kit-generator", category: "Agents", emoji: "🎨" },
  { name: "Contract Auditor", href: "/marketplace/smart-contract-auditor", category: "Agents", emoji: "🔍" },
  { name: "Perp Grid Bot", href: "/marketplace/perp-grid-bot", category: "Agents", emoji: "📈" },
  { name: "Portfolio Rebalancer", href: "/marketplace/portfolio-rebalancer", category: "Agents", emoji: "⚖️" },
  { name: "WOO Liquidity Bridge", href: "/marketplace/woo-liquidity-bridge", category: "Agents", emoji: "🌊" },
  { name: "Funding Rate Arb", href: "/marketplace/funding-rate-arb", category: "Agents", emoji: "💰" },
  { name: "Community Dashboard", href: "/marketplace/community-dashboard", category: "Agents", emoji: "📋" },
];

const TEAMS: CommandItem[] = [
  { name: "WOOFi Pro", href: "/teams/woofi-pro", category: "Teams", emoji: "🔷" },
  { name: "LogX Network", href: "/teams/logx-network", category: "Teams", emoji: "🟣" },
  { name: "Elixir DEX", href: "/teams/elixir-dex", category: "Teams", emoji: "🟢" },
];

const ALL_ITEMS: CommandItem[] = [...PAGES, ...AGENTS, ...TEAMS];
const MAX_PER_CATEGORY = 5;

function groupByCategory(items: CommandItem[]): Record<string, CommandItem[]> {
  const groups: Record<string, CommandItem[]> = {};
  for (const item of items) {
    if (!groups[item.category]) groups[item.category] = [];
    if (groups[item.category]!.length < MAX_PER_CATEGORY) {
      groups[item.category]!.push(item);
    }
  }
  return groups;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return groupByCategory(PAGES);
    const q = query.toLowerCase();
    const matches = ALL_ITEMS.filter((item) =>
      item.name.toLowerCase().includes(q)
    );
    return groupByCategory(matches);
  }, [query]);

  const flatItems = useMemo(() => {
    const items: CommandItem[] = [];
    for (const group of Object.values(filtered)) {
      items.push(...group);
    }
    return items;
  }, [filtered]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % Math.max(flatItems.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) =>
          i <= 0 ? Math.max(flatItems.length - 1, 0) : i - 1
        );
      } else if (e.key === "Enter" && flatItems[activeIndex]) {
        e.preventDefault();
        navigate(flatItems[activeIndex].href);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    },
    [flatItems, activeIndex, navigate]
  );

  useEffect(() => {
    const activeEl = listRef.current?.querySelector("[data-active='true']");
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) return null;

  let itemCounter = 0;
  const categoryOrder = ["Pages", "Agents", "Teams"];
  const sortedCategories = Object.keys(filtered).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[min(20vh,160px)]"
      onClick={() => setOpen(false)}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150" />

      <div
        className="relative max-w-xl w-full mx-4 bg-[rgba(12,10,26,0.95)] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4">
          <svg
            className="h-[18px] w-[18px] shrink-0 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agents, teams, pages..."
            className="flex-1 bg-transparent py-4 text-[16px] text-text-primary placeholder-text-muted outline-none"
          />
          <kbd className="shrink-0 rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[360px] overflow-y-auto overscroll-contain">
          {flatItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-text-muted">
              <svg
                className="mb-3 h-8 w-8 opacity-40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm">No results found</span>
            </div>
          ) : (
            <div className="py-2">
              {sortedCategories.map((category) => {
                const items = filtered[category];
                if (!items?.length) return null;

                return (
                  <div key={category}>
                    <div className="px-4 pb-1.5 pt-3 text-[11px] font-medium uppercase tracking-wider text-text-muted">
                      {query.trim() ? category : "Quick Links"}
                    </div>
                    {items.map((item) => {
                      const index = itemCounter++;
                      const isActive = index === activeIndex;
                      return (
                        <button
                          key={item.href}
                          data-active={isActive}
                          onClick={() => navigate(item.href)}
                          onMouseEnter={() => setActiveIndex(index)}
                          className={cn(
                            "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-75",
                            isActive
                              ? "bg-purple-500/[0.08] border-l-2 border-purple-500"
                              : "border-l-2 border-transparent hover:bg-white/[0.04]"
                          )}
                        >
                          <span className="text-base leading-none">
                            {item.emoji}
                          </span>
                          <span className="flex-1 truncate text-text-primary">
                            {item.name}
                          </span>
                          <svg
                            className={cn(
                              "h-3.5 w-3.5 text-text-muted transition-opacity",
                              isActive ? "opacity-100" : "opacity-0"
                            )}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-white/[0.06] px-4 py-2.5 flex items-center gap-4 text-[11px] text-text-muted">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-white/[0.08] bg-white/[0.04] px-1 py-0.5 font-mono text-[10px]">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-white/[0.08] bg-white/[0.04] px-1 py-0.5 font-mono text-[10px]">↵</kbd>
            open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-white/[0.08] bg-white/[0.04] px-1 py-0.5 font-mono text-[10px]">esc</kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}
