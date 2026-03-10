"use client";

import { useState } from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/use-wallet";
import { cn } from "@/lib/utils/cn";
import { Breadcrumb } from "@/components/shared/breadcrumb";

const mockPublisher = {
  name: "starchild-labs",
  displayName: "Starchild Labs",
  slug: "starchild-labs",
  description:
    "Vibe-coding agents that help DEX builders ship features 10x faster.",
  websiteUrl: "https://starchild.ai",
  twitterHandle: "StarchildAI",
  githubOrg: "starchild-labs",
  isVerified: true,
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[13px] text-text-primary placeholder-text-muted outline-none transition-all duration-300 focus:border-purple-500/30 focus:bg-white/[0.03]";

export default function PublisherEditPage() {
  const { isAuthenticated, signIn } = useWallet();

  const [form, setForm] = useState({
    displayName: mockPublisher.displayName,
    description: mockPublisher.description,
    websiteUrl: mockPublisher.websiteUrl,
    twitterHandle: mockPublisher.twitterHandle,
    githubOrg: mockPublisher.githubOrg,
  });

  const [toast, setToast] = useState(false);

  const updateForm = (updates: Partial<typeof form>) =>
    setForm((prev) => ({ ...prev, ...updates }));

  const handleSave = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

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
              <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h1 className="text-[24px] font-bold tracking-[-0.02em] text-text-primary">
            Connect Your Wallet
          </h1>
          <p className="mt-2 text-[15px] text-text-secondary">
            Connect your wallet to manage your publisher profile
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

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6">
      {/* Toast */}
      <div
        className={cn(
          "fixed right-6 top-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] px-5 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300",
          toast
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 pointer-events-none opacity-0"
        )}
      >
        <svg
          className="h-4 w-4 text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-[13px] font-medium text-emerald-300">
          Profile updated successfully
        </span>
      </div>

      <Breadcrumb
        items={[
          { label: "Marketplace", href: "/marketplace" },
          { label: "Edit Publisher Profile" },
        ]}
      />

      <div className="animate-fade-in">
        <h1 className="text-[24px] font-bold tracking-[-0.02em] text-text-primary">
          Publisher Profile
        </h1>
        <p className="mt-1.5 text-[15px] text-text-secondary">
          Manage how you appear across the marketplace
        </p>
      </div>

      <div className="glass-card animate-fade-in-up mt-8 rounded-2xl p-6 sm:p-8">
        {/* Avatar */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/[0.15] to-purple-900/[0.1] text-[32px] font-bold text-purple-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_24px_rgba(0,0,0,0.3)]">
            {form.displayName.charAt(0).toUpperCase()}
          </div>
          <span className="mt-3 text-[12px] font-medium text-text-muted transition-colors hover:text-purple-400 cursor-pointer">
            Change Avatar
          </span>
        </div>

        <div className="space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-[12px] font-medium text-text-muted">
              Display Name
            </label>
            <input
              type="text"
              value={form.displayName}
              onChange={(e) => updateForm({ displayName: e.target.value })}
              className={inputClass}
              placeholder="Your display name"
            />
          </div>

          {/* Slug (read-only) */}
          <div>
            <label className="block text-[12px] font-medium text-text-muted">
              Slug
            </label>
            <input
              type="text"
              value={mockPublisher.slug}
              readOnly
              className={cn(
                inputClass,
                "font-mono text-text-muted cursor-not-allowed opacity-60"
              )}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[12px] font-medium text-text-muted">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateForm({ description: e.target.value })}
              rows={3}
              className={inputClass}
              placeholder="Tell people what you build"
            />
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-[12px] font-medium text-text-muted">
              Website URL
            </label>
            <input
              type="url"
              value={form.websiteUrl}
              onChange={(e) => updateForm({ websiteUrl: e.target.value })}
              className={inputClass}
              placeholder="https://your-website.com"
            />
          </div>

          {/* Twitter Handle */}
          <div>
            <label className="block text-[12px] font-medium text-text-muted">
              Twitter Handle
            </label>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-text-muted">
                @
              </span>
              <input
                type="text"
                value={form.twitterHandle}
                onChange={(e) => updateForm({ twitterHandle: e.target.value })}
                className={cn(inputClass, "mt-0 pl-8")}
                placeholder="handle"
              />
            </div>
          </div>

          {/* GitHub Organization */}
          <div>
            <label className="block text-[12px] font-medium text-text-muted">
              GitHub Organization
            </label>
            <input
              type="text"
              value={form.githubOrg}
              onChange={(e) => updateForm({ githubOrg: e.target.value })}
              className={inputClass}
              placeholder="your-github-org"
            />
          </div>

          {/* Save */}
          <div className="pt-2">
            <button
              onClick={handleSave}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 py-3 text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.25)] hover:brightness-110"
            >
              <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
              <span className="relative">Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
