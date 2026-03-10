"use client";

import { useState } from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/use-wallet";
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

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CreateTeamPage() {
  const { isAuthenticated, signIn } = useWallet();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [tagline, setTagline] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [color, setColor] = useState(presetColors[0]);
  const [submitted, setSubmitted] = useState(false);

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
              <path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <h1 className="text-[24px] font-bold tracking-[-0.02em] text-text-primary">
            Connect Your Wallet
          </h1>
          <p className="mt-2 text-[15px] text-text-secondary">
            Connect your wallet to create a team
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

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-fade-in-up text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500/[0.12] to-emerald-900/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_40px_rgba(0,0,0,0.3)]">
            <svg
              className="h-8 w-8 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-[24px] font-bold tracking-[-0.02em] text-text-primary">
            Team created successfully!
          </h1>
          <p className="mt-2 text-[15px] text-text-secondary">
            Your team <span className="font-semibold text-text-primary">{name}</span> is ready to go.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href={`/teams/${slug}`}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-[9px] text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.2),0_1px_2px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:brightness-110"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
              <span className="relative">Go to your team</span>
            </Link>
            <Link
              href="/teams"
              className="rounded-full border border-white/[0.06] px-6 py-[9px] text-[13px] font-medium text-text-secondary transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.03]"
            >
              All Teams
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-12 sm:px-6">
      <div className="animate-fade-in">
        <h1 className="text-[28px] font-bold tracking-[-0.03em] text-text-primary">
          Create Your Team
        </h1>
        <p className="mt-2 text-[15px] leading-[1.7] text-text-secondary">
          Assemble your AI agent roster for your Orderly-powered DEX
        </p>
      </div>

      <div className="animate-fade-in-up mt-10 space-y-6" style={{ animationDelay: "100ms" }}>
        <div className="glass-card rounded-2xl p-6 space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-[12px] font-medium text-text-muted">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugEdited) setSlug(toSlug(e.target.value));
              }}
              className={inputClass}
              placeholder="WOOFi Pro"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-[12px] font-medium text-text-muted">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugEdited(true);
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-")
                );
              }}
              className={cn(inputClass, "font-mono")}
              placeholder="woofi-pro"
            />
            <p className="mt-1 text-[11px] text-text-muted">
              orderly.agents/teams/<span className="text-purple-400">{slug || "your-team"}</span>
            </p>
          </div>

          {/* Tagline */}
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
              placeholder="Institutional-grade trading on WOO's flagship DEX"
            />
          </div>

          {/* Website URL */}
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

          {/* Brand Color */}
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
        </div>

        {/* Preview */}
        <div className="glass-card rounded-2xl p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted">
            Preview
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[16px] font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}99)`,
                boxShadow: `0 4px 20px ${color}25`,
              }}
            >
              {name ? name.charAt(0).toUpperCase() : "T"}
            </div>
            <div>
              <p className="text-[14px] font-semibold text-text-primary">
                {name || "Your Team Name"}
              </p>
              {tagline && (
                <p className="text-[12px] text-text-muted">{tagline}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={() => setSubmitted(true)}
          disabled={!name.trim() || !slug.trim()}
          className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 py-3 text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.25)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
          <span className="relative">Create Team</span>
        </button>
      </div>
    </div>
  );
}
