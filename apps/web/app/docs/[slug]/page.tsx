import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: titleFromSlug(slug) };
}

export default async function DocArticlePage({ params }: Props) {
  const { slug } = await params;
  const title = titleFromSlug(slug);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6">
      <Breadcrumb
        items={[
          { label: "Documentation", href: "/docs" },
          { label: title },
        ]}
      />

      <div className="animate-fade-in">
        <h1 className="text-[30px] font-bold tracking-[-0.03em] text-text-primary sm:text-[36px]">
          {title}
        </h1>

        <div className="mt-4 flex items-center gap-3">
          <span className="rounded-md bg-white/[0.04] px-2.5 py-[3px] text-[11px] font-medium text-text-muted">
            Last updated December 2025
          </span>
          <span className="rounded-md bg-white/[0.04] px-2.5 py-[3px] text-[11px] font-medium text-text-muted">
            5 min read
          </span>
        </div>
      </div>

      {/* Article body */}
      <article className="prose prose-invert mt-10 max-w-none animate-fade-in-up">
        <p className="text-[15px] leading-[1.8] text-text-secondary">
          {title} is a core part of the OrderlyAgents ecosystem. This guide
          walks you through everything you need to know — from initial setup to
          production deployment. Whether you&apos;re building your first agent or
          scaling an existing fleet, this document covers the key concepts and
          practical steps.
        </p>

        <h2 className="mt-10 text-[20px] font-semibold tracking-[-0.02em] text-text-primary">
          Prerequisites
        </h2>
        <ul className="mt-4 space-y-2 text-[14px] leading-[1.7] text-text-secondary">
          <li className="flex items-start gap-2.5">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500/60" />
            Node.js 18+ and a package manager (npm, pnpm, or yarn)
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500/60" />
            An Orderly Network-compatible wallet (MetaMask, Rabby, etc.)
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500/60" />
            Basic familiarity with TypeScript and the Orderly SDK
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500/60" />
            A registered publisher profile on OrderlyAgents
          </li>
        </ul>

        <h2 className="mt-10 text-[20px] font-semibold tracking-[-0.02em] text-text-primary">
          Step 1: Setup
        </h2>
        <p className="mt-3 text-[14px] leading-[1.7] text-text-secondary">
          Start by scaffolding a new agent project using the OrderlyAgents CLI.
          This creates the recommended directory structure with all required
          configuration files.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 font-mono text-[13px] leading-[1.7] text-text-secondary">
          <pre>{`npx create-orderly-agent@latest my-agent
cd my-agent
pnpm install`}</pre>
        </div>

        <h2 className="mt-10 text-[20px] font-semibold tracking-[-0.02em] text-text-primary">
          Step 2: Configuration
        </h2>
        <p className="mt-3 text-[14px] leading-[1.7] text-text-secondary">
          Open the generated <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[12px] text-purple-300">agent.yaml</code> file
          and configure your agent&apos;s metadata, runtime tier, and
          permissions.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 font-mono text-[13px] leading-[1.7] text-text-secondary">
          <pre>{`# agent.yaml
name: my-agent
version: 1.0.0
runtime: skill
division: trading
risk_level: low
description: "A short description of what your agent does"
author: your-publisher-slug
supported_chains:
  - all`}</pre>
        </div>

        <h2 className="mt-10 text-[20px] font-semibold tracking-[-0.02em] text-text-primary">
          Step 3: Testing
        </h2>
        <p className="mt-3 text-[14px] leading-[1.7] text-text-secondary">
          Before publishing, validate your agent locally. The CLI includes a
          built-in test harness that simulates the marketplace install flow,
          verifies schema compliance, and runs your agent against a sandboxed
          Orderly testnet environment. Run{" "}
          <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[12px] text-purple-300">
            pnpm test
          </code>{" "}
          to execute all checks.
        </p>

        <h2 className="mt-10 text-[20px] font-semibold tracking-[-0.02em] text-text-primary">
          Next Steps
        </h2>
        <p className="mt-3 text-[14px] leading-[1.7] text-text-secondary">
          Now that you have a working agent, explore these resources to go
          further:
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {[
            { label: "Building a Skill Agent", href: "/docs/building-a-skill-agent" },
            { label: "Building an MCP Server", href: "/docs/building-an-mcp-server" },
            { label: "Agent Spec Schema", href: "/docs/agent-spec-schema" },
            { label: "REST API Reference", href: "/docs/rest-api-reference" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-purple-400 transition-colors hover:text-purple-300"
            >
              {link.label}
              <svg
                className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          ))}
        </div>
      </article>
    </div>
  );
}
