"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils/cn";

interface InstallGuideProps {
  agent: {
    name: string;
    slug: string;
    runtime: "skill" | "mcp" | "hosted" | "hybrid";
    skillFileUrl: string | null;
    mcpServerUrl: string | null;
    hostedEndpoint: string | null;
    version: string;
  };
  open: boolean;
  onClose: () => void;
}

function useCopyToClipboard() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = useCallback(async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);

  return { copiedKey, copy };
}

function CodeBlock({
  code,
  copyKey,
  copiedKey,
  onCopy,
  label,
}: {
  code: string;
  copyKey: string;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
  label?: string;
}) {
  const isCopied = copiedKey === copyKey;

  return (
    <div className="group/code relative rounded-xl border border-white/[0.06] bg-white/[0.02]">
      {label && (
        <div className="border-b border-white/[0.04] px-4 py-2">
          <span className="font-mono text-[11px] text-text-muted">{label}</span>
        </div>
      )}
      <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-[1.7] text-text-secondary">
        {code}
      </pre>
      <button
        onClick={() => onCopy(code, copyKey)}
        className={cn(
          "absolute right-2.5 top-2.5 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-all duration-200",
          isCopied
            ? "border-green-500/30 bg-green-500/[0.1] text-green-400"
            : "border-white/[0.06] bg-white/[0.03] text-text-muted opacity-0 group-hover/code:opacity-100 hover:border-white/[0.1] hover:text-text-secondary"
        )}
      >
        {isCopied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

function Stepper({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <div className="flex items-center justify-center gap-0 px-6">
      {steps.map((label, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;

        return (
          <div key={label} className="flex items-center">
            {i > 0 && (
              <div
                className={cn(
                  "h-px w-10 transition-colors duration-300 sm:w-14",
                  isCompleted ? "bg-purple-500" : "bg-white/[0.08]"
                )}
              />
            )}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold transition-all duration-300",
                  isCompleted &&
                    "bg-purple-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]",
                  isActive &&
                    "bg-purple-600 text-white shadow-[0_0_16px_rgba(139,92,246,0.4)] ring-2 ring-purple-500/30",
                  !isCompleted &&
                    !isActive &&
                    "border border-white/[0.1] text-text-muted"
                )}
              >
                {isCompleted ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  "max-w-[80px] text-center text-[10px] font-medium leading-tight transition-colors duration-300",
                  isActive ? "text-white" : "text-text-muted"
                )}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SuccessStep({ agentName }: { agentName: string }) {
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShowCheck(true), 150);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all duration-500",
          showCheck ? "scale-100 opacity-100" : "scale-50 opacity-0"
        )}
      >
        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h3 className="mt-5 text-[18px] font-bold tracking-[-0.02em] text-text-primary">
        You&apos;re all set
      </h3>
      <p className="mt-2 text-[13px] leading-[1.6] text-text-secondary">
        Start using {agentName} by mentioning it in your next prompt.
      </p>

      <div className="mt-5 w-full glass-card rounded-xl p-4">
        <p className="text-left font-mono text-[12px] leading-[1.7] text-purple-300/80">
          &ldquo;Use the {agentName} to analyze the current orderbook depth for BTC-PERP&rdquo;
        </p>
      </div>

      <a
        href="#"
        className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-purple-400 transition-colors duration-200 hover:text-purple-300"
      >
        View Documentation
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </a>
    </div>
  );
}

function SkillSteps({
  agent,
  currentStep,
  copiedKey,
  onCopy,
}: {
  agent: InstallGuideProps["agent"];
  currentStep: number;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}) {
  const [selectedClient, setSelectedClient] = useState<"cursor" | "claude" | "other">("cursor");
  const skillUrl = agent.skillFileUrl || `https://agents.orderly.network/skills/${agent.slug}/SKILL.md`;
  const cpCommand = `cp ~/Downloads/SKILL.md ~/.cursor/skills/agents/${agent.slug}/SKILL.md`;

  if (currentStep === 0) {
    return (
      <div className="animate-fade-in-up space-y-5">
        <div>
          <h3 className="text-[16px] font-bold tracking-[-0.02em] text-text-primary">
            Download the Skill file
          </h3>
          <p className="mt-1.5 text-[13px] leading-[1.6] text-text-secondary">
            The skill file contains instructions your AI assistant will follow.
          </p>
        </div>

        <a
          href={skillUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 px-5 py-3 text-[14px] font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.2),0_1px_2px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:brightness-110"
        >
          <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/10 to-transparent" />
          <svg className="relative h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="relative">Download SKILL.md</span>
        </a>

        <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] px-4 py-3">
          <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
            File path
          </span>
          <p className="mt-1 font-mono text-[12px] text-purple-300/80">
            ~/.cursor/skills/agents/{agent.slug}/SKILL.md
          </p>
        </div>
      </div>
    );
  }

  if (currentStep === 1) {
    const clients = [
      {
        id: "cursor" as const,
        name: "Cursor",
        desc: "Drop the SKILL.md into your .cursor/skills/ directory",
      },
      {
        id: "claude" as const,
        name: "Claude Desktop",
        desc: "Add to your Claude Desktop skill library",
      },
      {
        id: "other" as const,
        name: "Other",
        desc: "Compatible with any LLM that supports skill files",
      },
    ];

    return (
      <div className="animate-fade-in-up space-y-5">
        <div>
          <h3 className="text-[16px] font-bold tracking-[-0.02em] text-text-primary">
            Add to your AI assistant
          </h3>
          <p className="mt-1.5 text-[13px] leading-[1.6] text-text-secondary">
            Choose where you want to use this agent.
          </p>
        </div>

        <div className="space-y-2">
          {clients.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClient(c.id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200",
                selectedClient === c.id
                  ? "border-purple-500/30 bg-purple-500/[0.06] shadow-[0_0_12px_rgba(139,92,246,0.08)]"
                  : "border-white/[0.06] bg-white/[0.015] hover:border-white/[0.1] hover:bg-white/[0.025]"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                  selectedClient === c.id
                    ? "border-purple-500 bg-purple-500"
                    : "border-white/20"
                )}
              >
                {selectedClient === c.id && (
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </div>
              <div>
                <span className="text-[13px] font-semibold text-text-primary">
                  {c.name}
                </span>
                <p className="mt-0.5 text-[12px] leading-[1.5] text-text-muted">
                  {c.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {selectedClient === "cursor" && (
          <CodeBlock
            code={cpCommand}
            copyKey="skill-cp"
            copiedKey={copiedKey}
            onCopy={onCopy}
            label="Terminal"
          />
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <SuccessStep agentName={agent.name} />
    </div>
  );
}

function McpSteps({
  agent,
  currentStep,
  copiedKey,
  onCopy,
}: {
  agent: InstallGuideProps["agent"];
  currentStep: number;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}) {
  const mcpUrl = agent.mcpServerUrl || `https://mcp.orderly.network/${agent.slug}`;

  const claudeConfig = JSON.stringify(
    {
      mcpServers: {
        [agent.slug]: { url: mcpUrl },
      },
    },
    null,
    2
  );

  const cursorConfig = `// .cursor/mcp.json\n${JSON.stringify(
    {
      servers: {
        [agent.slug]: { url: mcpUrl },
      },
    },
    null,
    2
  )}`;

  if (currentStep === 0) {
    return (
      <div className="animate-fade-in-up space-y-5">
        <div>
          <h3 className="text-[16px] font-bold tracking-[-0.02em] text-text-primary">
            Copy the MCP server URL
          </h3>
          <p className="mt-1.5 text-[13px] leading-[1.6] text-text-secondary">
            This URL connects your AI assistant to live data.
          </p>
        </div>

        <CodeBlock
          code={mcpUrl}
          copyKey="mcp-url"
          copiedKey={copiedKey}
          onCopy={onCopy}
        />
      </div>
    );
  }

  if (currentStep === 1) {
    return (
      <div className="animate-fade-in-up space-y-5">
        <div>
          <h3 className="text-[16px] font-bold tracking-[-0.02em] text-text-primary">
            Configure your MCP client
          </h3>
          <p className="mt-1.5 text-[13px] leading-[1.6] text-text-secondary">
            Add this configuration to your preferred client.
          </p>
        </div>

        <CodeBlock
          code={claudeConfig}
          copyKey="mcp-claude"
          copiedKey={copiedKey}
          onCopy={onCopy}
          label="Claude Desktop — claude_desktop_config.json"
        />

        <CodeBlock
          code={cursorConfig}
          copyKey="mcp-cursor"
          copiedKey={copiedKey}
          onCopy={onCopy}
          label="Cursor — .cursor/mcp.json"
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <SuccessStep agentName={agent.name} />
    </div>
  );
}

function HostedContent() {
  return (
    <div className="flex flex-col items-center py-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04]">
        <svg className="h-7 w-7 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      </div>

      <h3 className="mt-5 text-[18px] font-bold tracking-[-0.02em] text-text-primary">
        Coming Soon
      </h3>
      <p className="mt-2 max-w-xs text-[13px] leading-[1.6] text-text-secondary">
        Hosted agents run autonomously on our infrastructure. This tier is currently in development.
      </p>

      <button className="mt-6 rounded-full border border-white/[0.08] bg-white/[0.02] px-6 py-2.5 text-[13px] font-semibold text-text-secondary transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.04]">
        Join Waitlist
      </button>
      <p className="mt-3 text-[12px] text-text-muted">
        Notify me when available
      </p>
    </div>
  );
}

const STEP_LABELS: Record<string, string[]> = {
  skill: ["Download", "Configure", "Done"],
  mcp: ["Copy URL", "Configure", "Done"],
  hybrid: ["Copy URL", "Configure", "Done"],
};

export function InstallGuide({ agent, open, onClose }: InstallGuideProps) {
  const [step, setStep] = useState(0);
  const { copiedKey, copy } = useCopyToClipboard();

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const isHosted = agent.runtime === "hosted";
  const effectiveRuntime = agent.runtime === "hybrid" ? "mcp" : agent.runtime;
  const totalSteps = isHosted ? 0 : 3;
  const labels: string[] = STEP_LABELS[agent.runtime] ?? ["Copy URL", "Configure", "Done"];
  const isLastStep = step === totalSteps - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Panel */}
      <div
        className={cn(
          "relative mx-4 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[rgba(12,10,26,0.97)] shadow-2xl",
          "animate-fade-in-up"
        )}
      >
        {/* Top accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-[16px] font-bold tracking-[-0.02em] text-text-primary">
              Install {agent.name}
            </h2>
            <span className="mt-0.5 block font-mono text-[11px] text-text-muted">
              v{agent.version} · {agent.runtime}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors duration-200 hover:bg-white/[0.04] hover:text-text-secondary"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stepper */}
        {!isHosted && (
          <div className="px-6 pb-5 pt-1">
            <Stepper steps={labels} currentStep={step} />
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-white/[0.04]" />

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isHosted && <HostedContent />}
          {effectiveRuntime === "skill" && !isHosted && (
            <SkillSteps
              agent={agent}
              currentStep={step}
              copiedKey={copiedKey}
              onCopy={copy}
            />
          )}
          {effectiveRuntime === "mcp" && !isHosted && (
            <McpSteps
              agent={agent}
              currentStep={step}
              copiedKey={copiedKey}
              onCopy={copy}
            />
          )}
        </div>

        {/* Footer nav */}
        {!isHosted && (
          <>
            <div className="h-px bg-white/[0.04]" />
            <div className="flex items-center justify-between px-6 py-4">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className={cn(
                  "rounded-lg px-4 py-2 text-[13px] font-medium transition-all duration-200",
                  step === 0
                    ? "cursor-not-allowed text-text-muted/40"
                    : "text-text-secondary hover:bg-white/[0.04] hover:text-text-primary"
                )}
              >
                Back
              </button>

              {isLastStep ? (
                <button
                  onClick={onClose}
                  className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 px-5 py-2 text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:brightness-110"
                >
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/10 to-transparent" />
                  <span className="relative">Done</span>
                </button>
              ) : (
                <button
                  onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}
                  className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 px-5 py-2 text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:brightness-110"
                >
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/10 to-transparent" />
                  <span className="relative">Continue</span>
                </button>
              )}
            </div>
          </>
        )}

        {/* Hosted close button */}
        {isHosted && (
          <>
            <div className="h-px bg-white/[0.04]" />
            <div className="flex justify-end px-6 py-4">
              <button
                onClick={onClose}
                className="rounded-lg px-5 py-2 text-[13px] font-medium text-text-secondary transition-all duration-200 hover:bg-white/[0.04] hover:text-text-primary"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
