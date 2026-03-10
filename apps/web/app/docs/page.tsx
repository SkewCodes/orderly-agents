import Link from "next/link";

const gettingStarted = [
  {
    slug: "what-is-orderly-agents",
    title: "What is OrderlyAgents?",
    description:
      "A brief introduction to the platform, its mission, and how it fits into the Orderly ecosystem.",
    readTime: "3 min",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
  {
    slug: "your-first-agent",
    title: "Your First Agent",
    description:
      "Step-by-step guide to publishing your first agent on the marketplace.",
    readTime: "10 min",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
  },
  {
    slug: "understanding-runtimes",
    title: "Understanding Runtimes",
    description:
      "Skill, MCP, and Hosted runtimes explained — choose the right tier for your agent.",
    readTime: "5 min",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
      </svg>
    ),
  },
];

const buildGuides = [
  {
    slug: "building-a-skill-agent",
    title: "Building a Skill Agent",
    description:
      "Learn to create a SKILL.md file that works with Claude, Cursor, and other LLM assistants.",
    tags: ["Skill", "Beginner"],
    dimmed: false,
  },
  {
    slug: "building-an-mcp-server",
    title: "Building an MCP Server",
    description:
      "Connect live data sources to AI assistants using the Model Context Protocol.",
    tags: ["MCP", "Intermediate"],
    dimmed: false,
  },
  {
    slug: "hosted-agents",
    title: "Hosted Agents (Coming Soon)",
    description:
      "Deploy autonomous agents that execute strategies server-side.",
    tags: ["Hosted", "Advanced"],
    dimmed: true,
  },
];

const reference = [
  {
    slug: "agent-spec-schema",
    title: "Agent Spec Schema",
    description: "The complete JSON schema for agent.yaml manifests",
  },
  {
    slug: "rest-api-reference",
    title: "REST API Reference",
    description:
      "Endpoints for agents, teams, publishers, and installs",
  },
  {
    slug: "orderly-sdk-integration",
    title: "Orderly SDK Integration",
    description:
      "How agents interact with the Orderly Network SDK",
  },
  {
    slug: "webhook-events",
    title: "Webhook Events",
    description:
      "Events emitted during agent lifecycle (install, star, review)",
  },
];

export default function DocsPage() {
  return (
    <div>
      {/* Hero */}
      <div className="hero-glow relative overflow-hidden pb-16 pt-20 text-center">
        <div className="animate-fade-in-up mx-auto max-w-2xl px-5">
          <h1 className="gradient-text text-[36px] font-bold tracking-[-0.03em] sm:text-[44px]">
            Documentation
          </h1>
          <p className="mt-4 text-[16px] leading-[1.7] text-text-secondary sm:text-[17px]">
            Everything you need to build, publish, and deploy AI agents on
            Orderly
          </p>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-lg">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] py-3 pl-11 pr-4 text-[14px] text-text-primary placeholder-text-muted outline-none backdrop-blur-sm transition-all duration-300 focus:border-purple-500/30 focus:bg-white/[0.03]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8">
        {/* Getting Started */}
        <section>
          <h2 className="text-[20px] font-bold tracking-[-0.02em] text-text-primary">
            Getting Started
          </h2>
          <p className="mt-1.5 text-[14px] text-text-muted">
            New to OrderlyAgents? Start here.
          </p>

          <div className="stagger-children mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gettingStarted.map((guide) => (
              <Link key={guide.slug} href={`/docs/${guide.slug}`}>
                <div className="glass-card card-hover group flex h-full flex-col rounded-2xl p-6 transition-all duration-300">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/[0.12] to-purple-900/[0.08] text-purple-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                    {guide.icon}
                  </div>
                  <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.01em] text-text-primary">
                    {guide.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-[13px] leading-[1.6] text-text-muted">
                    {guide.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="rounded-md bg-white/[0.04] px-2 py-[3px] text-[11px] font-medium text-text-muted">
                      {guide.readTime} read
                    </span>
                    <svg
                      className="h-4 w-4 text-text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Build Guides */}
        <section className="mt-16">
          <h2 className="text-[20px] font-bold tracking-[-0.02em] text-text-primary">
            Build Guides
          </h2>
          <p className="mt-1.5 text-[14px] text-text-muted">
            Deep-dive tutorials for every runtime tier.
          </p>

          <div className="stagger-children mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {buildGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={guide.dimmed ? "#" : `/docs/${guide.slug}`}
                aria-disabled={guide.dimmed}
                className={guide.dimmed ? "pointer-events-none" : ""}
              >
                <div
                  className={`glass-card group flex h-full flex-col rounded-2xl p-6 transition-all duration-300 ${guide.dimmed ? "opacity-40" : "card-hover"}`}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {guide.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-purple-500/[0.08] px-2 py-[3px] text-[11px] font-medium text-purple-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-4 text-[16px] font-semibold tracking-[-0.01em] text-text-primary">
                    {guide.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[13px] leading-[1.7] text-text-muted">
                    {guide.description}
                  </p>
                  {!guide.dimmed && (
                    <div className="mt-5 flex items-center gap-1 text-[13px] font-medium text-purple-400 transition-colors group-hover:text-purple-300">
                      Read guide
                      <svg
                        className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Reference */}
        <section className="mt-16">
          <h2 className="text-[20px] font-bold tracking-[-0.02em] text-text-primary">
            Reference
          </h2>
          <p className="mt-1.5 text-[14px] text-text-muted">
            Technical specifications and API docs.
          </p>

          <div className="stagger-children mt-6 grid gap-5 sm:grid-cols-2">
            {reference.map((item) => (
              <Link key={item.slug} href={`/docs/${item.slug}`}>
                <div className="glass-card card-hover group flex items-center justify-between rounded-2xl p-5 transition-all duration-300">
                  <div>
                    <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[13px] text-text-muted">
                      {item.description}
                    </p>
                  </div>
                  <svg
                    className="ml-4 h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
