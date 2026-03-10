"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/use-wallet";
import { trpc } from "@/lib/trpc/client";
import { divisions, riskLevels } from "@orderly-agents/agent-schema";
import { cn } from "@/lib/utils/cn";
import { RuntimeBadge } from "@/components/agents/runtime-badge";
import { RiskIndicator } from "@/components/agents/risk-indicator";

type FormData = {
  runtime: "skill" | "mcp" | "hosted";
  name: string;
  version: string;
  description: string;
  longDescription: string;
  division: (typeof divisions)[number];
  riskLevel: (typeof riskLevels)[number];
  author: string;
  authorWallet: string;
  supportedChains: string;
  tags: string;
  mcpServerUrl: string;
  sourceRepoUrl: string;
};

const steps = [
  { label: "Runtime", description: "Choose your agent type" },
  { label: "Details", description: "Define your agent" },
  { label: "Preview", description: "Review & submit" },
];

const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[13px] text-text-primary placeholder-text-muted outline-none transition-all duration-300 focus:border-purple-500/30 focus:bg-white/[0.03]";

const selectClass =
  "mt-1.5 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[13px] text-text-primary outline-none transition-all duration-300 focus:border-purple-500/30 focus:bg-white/[0.03] [&>option]:bg-[#0C0A1A]";

export default function PublishPage() {
  const router = useRouter();
  const { address, isAuthenticated, signIn } = useWallet();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    runtime: "skill",
    name: "",
    version: "1.0.0",
    description: "",
    longDescription: "",
    division: "trading",
    riskLevel: "low",
    author: "",
    authorWallet: "",
    supportedChains: "all",
    tags: "",
    mcpServerUrl: "",
    sourceRepoUrl: "",
  });

  const publisherQuery = trpc.publishers.me.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const registerMutation = trpc.publishers.register.useMutation();
  const submitMutation = trpc.agents.submit.useMutation();

  const [publisherForm, setPublisherForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const updateForm = (updates: Partial<FormData>) =>
    setForm((prev) => ({ ...prev, ...updates }));

  if (!isAuthenticated) {
    return (
      <div className="hero-glow relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="animate-fade-in-up relative text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500/[0.12] to-purple-900/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_40px_rgba(0,0,0,0.3)]">
            <svg className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          <h1 className="text-[24px] font-bold tracking-[-0.02em] text-text-primary">
            Connect Your Wallet
          </h1>
          <p className="mt-2 text-[15px] text-text-secondary">
            You need to connect your wallet to publish an agent
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

  if (publisherQuery.data === undefined && publisherQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-500" />
      </div>
    );
  }

  if (!publisherQuery.data) {
    return (
      <div className="hero-glow relative overflow-hidden">
        <div className="mx-auto max-w-lg px-5 py-20">
          <div className="animate-fade-in-up">
            <h1 className="text-[24px] font-bold tracking-[-0.02em] text-text-primary">
              Register as Publisher
            </h1>
            <p className="mt-2 text-[15px] text-text-secondary">
              Create a publisher profile before submitting your first agent
            </p>
            <div className="mt-8 space-y-5">
              <div>
                <label className="block text-[12px] font-medium text-text-muted">
                  Display Name
                </label>
                <input
                  type="text"
                  value={publisherForm.name}
                  onChange={(e) =>
                    setPublisherForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Your name or org"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-text-muted">
                  Slug
                </label>
                <input
                  type="text"
                  value={publisherForm.slug}
                  onChange={(e) =>
                    setPublisherForm((p) => ({
                      ...p,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-"),
                    }))
                  }
                  className={cn(inputClass, "font-mono")}
                  placeholder="your-name"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-text-muted">
                  Description
                </label>
                <textarea
                  value={publisherForm.description}
                  onChange={(e) =>
                    setPublisherForm((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className={inputClass}
                  placeholder="What do you build?"
                />
              </div>
              <button
                onClick={() =>
                  registerMutation.mutate(publisherForm, {
                    onSuccess: () => publisherQuery.refetch(),
                  })
                }
                disabled={
                  registerMutation.isPending ||
                  !publisherForm.name ||
                  !publisherForm.slug
                }
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 py-3 text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.25)] hover:brightness-110 disabled:opacity-50"
              >
                <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                <span className="relative">
                  {registerMutation.isPending ? "Creating..." : "Create Profile"}
                </span>
              </button>
              {registerMutation.error && (
                <p className="text-[13px] text-red-400">
                  {registerMutation.error.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    const tagsArray = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const chainsArray =
      form.supportedChains === "all"
        ? ["all"]
        : form.supportedChains
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean);

    submitMutation.mutate(
      {
        name: form.name,
        version: form.version,
        description: form.description,
        longDescription: form.longDescription || undefined,
        division: form.division,
        runtime: form.runtime,
        riskLevel: form.riskLevel,
        author: form.author || publisherQuery.data!.displayName,
        authorWallet: address ?? "",
        supportedChains: chainsArray,
        tags: tagsArray,
        mcpServerUrl: form.mcpServerUrl || undefined,
        sourceRepoUrl: form.sourceRepoUrl || undefined,
      },
      {
        onSuccess: (agent) => {
          if (agent) router.push(`/marketplace/${agent.slug}`);
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:px-6">
      <div className="animate-fade-in">
        <h1 className="text-[24px] font-bold tracking-[-0.02em] text-text-primary">
          Publish Agent
        </h1>
        <p className="mt-1.5 text-[15px] text-text-secondary">
          Submit your agent to the OrderlyAgents marketplace
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mt-10 flex items-center">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center">
            <button
              onClick={() => i < step && setStep(i)}
              className="flex items-center gap-2.5"
              disabled={i > step}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold transition-all duration-300",
                  i === step
                    ? "bg-purple-600 text-white shadow-[0_0_16px_rgba(139,92,246,0.3)]"
                    : i < step
                      ? "bg-purple-500/[0.12] text-purple-400 cursor-pointer"
                      : "bg-white/[0.04] text-text-muted"
                )}
              >
                {i < step ? (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <div className="hidden sm:block">
                <p
                  className={cn(
                    "text-[13px] font-medium",
                    i === step ? "text-text-primary" : "text-text-muted"
                  )}
                >
                  {s.label}
                </p>
              </div>
            </button>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-4 h-px w-12 transition-colors duration-300",
                  i < step ? "bg-purple-500/30" : "bg-white/[0.04]"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mt-10 animate-fade-in">
        {step === 0 && (
          <div className="space-y-3">
            <h2 className="text-[16px] font-semibold text-text-primary">
              Choose Runtime Tier
            </h2>
            {(["skill", "mcp", "hosted"] as const).map((rt) => (
              <button
                key={rt}
                onClick={() => {
                  updateForm({ runtime: rt });
                  if (rt !== "hosted") setStep(1);
                }}
                disabled={rt === "hosted"}
                className={cn(
                  "glass-card card-hover w-full rounded-2xl p-5 text-left transition-all duration-300",
                  form.runtime === rt && rt !== "hosted"
                    ? "border-purple-500/20 bg-purple-500/[0.04] shadow-[0_0_16px_rgba(139,92,246,0.08)]"
                    : "",
                  rt === "hosted" && "opacity-40 cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[14px] font-semibold text-text-primary">
                        {rt === "skill"
                          ? "Tier 1 — Skill"
                          : rt === "mcp"
                            ? "Tier 2 — MCP Server"
                            : "Tier 3 — Hosted"}
                      </span>
                      <RuntimeBadge runtime={rt} />
                    </div>
                    <p className="mt-1.5 text-[13px] leading-[1.6] text-text-muted">
                      {rt === "skill"
                        ? "Downloadable Claude Skill (SKILL.md + scripts)"
                        : rt === "mcp"
                          ? "MCP server connector with live data access"
                          : "Autonomous server-side execution (Coming Soon)"}
                    </p>
                  </div>
                  {form.runtime === rt && rt !== "hosted" && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-[16px] font-semibold text-text-primary">
              Agent Details
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-[12px] font-medium text-text-muted">
                  Name (kebab-case)
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    updateForm({
                      name: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-"),
                    })
                  }
                  className={cn(inputClass, "font-mono")}
                  placeholder="my-agent-name"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-text-muted">
                  Version
                </label>
                <input
                  type="text"
                  value={form.version}
                  onChange={(e) => updateForm({ version: e.target.value })}
                  className={cn(inputClass, "font-mono")}
                  placeholder="1.0.0"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-text-muted">
                Short Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => updateForm({ description: e.target.value })}
                rows={3}
                className={inputClass}
                placeholder="What does your agent do?"
              />
              <p className="mt-1.5 text-[11px] tabular-nums text-text-muted">
                {form.description.length} / 500
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-[12px] font-medium text-text-muted">
                  Division
                </label>
                <select
                  value={form.division}
                  onChange={(e) =>
                    updateForm({
                      division: e.target.value as typeof form.division,
                    })
                  }
                  className={selectClass}
                >
                  {divisions.map((d) => (
                    <option key={d} value={d}>
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-text-muted">
                  Risk Level
                </label>
                <select
                  value={form.riskLevel}
                  onChange={(e) =>
                    updateForm({
                      riskLevel: e.target.value as typeof form.riskLevel,
                    })
                  }
                  className={selectClass}
                >
                  {riskLevels.map((r) => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-text-muted">
                Tags (comma-separated, max 10)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => updateForm({ tags: e.target.value })}
                className={inputClass}
                placeholder="trading, automation, perps"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-text-muted">
                Supported Chains (comma-separated or &quot;all&quot;)
              </label>
              <input
                type="text"
                value={form.supportedChains}
                onChange={(e) =>
                  updateForm({ supportedChains: e.target.value })
                }
                className={inputClass}
                placeholder="all"
              />
            </div>

            {form.runtime === "mcp" && (
              <div>
                <label className="block text-[12px] font-medium text-text-muted">
                  MCP Server URL
                </label>
                <input
                  type="url"
                  value={form.mcpServerUrl}
                  onChange={(e) =>
                    updateForm({ mcpServerUrl: e.target.value })
                  }
                  className={inputClass}
                  placeholder="https://your-mcp-server.com"
                />
              </div>
            )}

            <div>
              <label className="block text-[12px] font-medium text-text-muted">
                Source Repo URL (optional)
              </label>
              <input
                type="url"
                value={form.sourceRepoUrl}
                onChange={(e) =>
                  updateForm({ sourceRepoUrl: e.target.value })
                }
                className={inputClass}
                placeholder="https://github.com/your-org/your-agent"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-text-muted">
                Long Description (Markdown, optional)
              </label>
              <textarea
                value={form.longDescription}
                onChange={(e) =>
                  updateForm({ longDescription: e.target.value })
                }
                rows={8}
                className={cn(inputClass, "font-mono text-[12px]")}
                placeholder="## Overview&#10;&#10;Detailed description of your agent..."
              />
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(0)}
                className="rounded-full border border-white/[0.06] px-5 py-[8px] text-[13px] font-medium text-text-secondary transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.03]"
              >
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!form.name || !form.description || form.description.length < 20}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-[8px] text-[13px] font-semibold text-white shadow-[0_0_16px_rgba(139,92,246,0.15)] transition-all duration-300 hover:shadow-[0_0_24px_rgba(139,92,246,0.25)] hover:brightness-110 disabled:opacity-50"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
                <span className="relative">Preview</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-[16px] font-semibold text-text-primary">
              Preview Listing
            </h2>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/[0.12] to-purple-900/[0.08] text-xl shadow-[inset_0_0.5px_0_rgba(255,255,255,0.06)]">
                  🤖
                </span>
                <div>
                  <h3 className="text-[16px] font-bold tracking-[-0.01em] text-text-primary">
                    {form.name || "agent-name"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <RuntimeBadge runtime={form.runtime} />
                    <RiskIndicator level={form.riskLevel} showLabel />
                    <span className="rounded-md bg-white/[0.04] px-1.5 py-0.5 font-mono text-[11px] text-text-muted">
                      v{form.version}
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-[14px] leading-[1.6] text-text-secondary">
                {form.description || "No description provided"}
              </p>
              {form.tags && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {form.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-white/[0.04] px-2 py-[3px] text-[11px] font-medium text-text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-amber-500/10 bg-amber-500/[0.03] p-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-[13px] leading-[1.6] text-amber-200/80">
                  Your agent will be submitted for review. It will appear in the
                  marketplace once approved.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="rounded-full border border-white/[0.06] px-5 py-[8px] text-[13px] font-medium text-text-secondary transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.03]"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-[8px] text-[13px] font-semibold text-white shadow-[0_0_16px_rgba(139,92,246,0.15)] transition-all duration-300 hover:shadow-[0_0_24px_rgba(139,92,246,0.25)] hover:brightness-110 disabled:opacity-50"
              >
                <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
                <span className="relative">
                  {submitMutation.isPending
                    ? "Submitting..."
                    : "Submit for Review"}
                </span>
              </button>
            </div>

            {submitMutation.error && (
              <p className="text-[13px] text-red-400">
                {submitMutation.error.message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
