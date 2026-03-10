import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { serverCaller } from "@/lib/trpc/server";
import { PublisherBadge } from "@/components/publishers/publisher-badge";
import { AgentCard } from "@/components/agents/agent-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { formatNumber } from "@/lib/utils/format";
import { getMockPublisherDetail } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ publisherId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { publisherId } = await params;
  try {
    const caller = await serverCaller();
    const publisher = await caller.publishers.getBySlug({ slug: publisherId });
    if (!publisher) throw new Error("not found");
    return {
      title: publisher.displayName,
      description:
        publisher.description ??
        `${publisher.displayName} on OrderlyAgents`,
    };
  } catch {
    const mock = getMockPublisherDetail(publisherId);
    if (mock) return { title: mock.displayName };
    return { title: "Publisher" };
  }
}

export default async function PublisherProfilePage({ params }: Props) {
  const { publisherId } = await params;

  let publisher;
  try {
    const caller = await serverCaller();
    publisher = await caller.publishers.getBySlug({ slug: publisherId });
  } catch {
    publisher = null;
  }

  if (!publisher) {
    const mock = getMockPublisherDetail(publisherId);
    if (!mock) notFound();
    publisher = mock;
  }

  if (!publisher) notFound();

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Marketplace", href: "/marketplace" },
          { label: publisher.displayName },
        ]}
      />
      {/* Publisher Header */}
      <div className="animate-fade-in glass-card mb-10 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/[0.12] to-purple-900/[0.08] text-[22px] font-bold text-purple-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              {publisher.displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-[24px] font-bold tracking-[-0.02em] text-text-primary">
                {publisher.displayName}
              </h1>
              <PublisherBadge
                isVerified={publisher.isVerified}
                isEcosystemPartner={publisher.isEcosystemPartner}
                className="mt-2"
              />
              {publisher.description && (
                <p className="mt-2.5 max-w-xl text-[14px] leading-[1.7] text-text-secondary">
                  {publisher.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-4">
                {publisher.websiteUrl && (
                  <a
                    href={publisher.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[13px] font-medium text-purple-400 transition-colors duration-200 hover:text-purple-300"
                  >
                    Website
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </a>
                )}
                {publisher.twitterHandle && (
                  <a
                    href={`https://twitter.com/${publisher.twitterHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-medium text-purple-400 transition-colors duration-200 hover:text-purple-300"
                  >
                    @{publisher.twitterHandle}
                  </a>
                )}
                {publisher.githubOrg && (
                  <a
                    href={`https://github.com/${publisher.githubOrg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[13px] font-medium text-purple-400 transition-colors duration-200 hover:text-purple-300"
                  >
                    GitHub
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/publisher/edit"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] px-4 py-[6px] text-[12px] font-medium text-text-secondary transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.03] hover:text-text-primary"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
              Edit Profile
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8">
            {[
              { value: publisher.agentCount, label: "Agents" },
              { value: formatNumber(publisher.totalInstalls), label: "Installs" },
              { value: formatNumber(publisher.totalStars), label: "Stars" },
            ].map((stat, i, arr) => (
              <div key={stat.label} className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-[18px] font-semibold tabular-nums tracking-[-0.02em] text-text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
                    {stat.label}
                  </p>
                </div>
                {i < arr.length - 1 && (
                  <div className="h-8 w-px bg-white/[0.06]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <h2 className="mb-6 text-[18px] font-semibold tracking-[-0.01em] text-text-primary">
        Agents by {publisher.displayName}
      </h2>

      {publisher.agents.length > 0 ? (
        <div className="stagger-children grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {publisher.agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={{
                ...agent,
                tags: agent.tags as string[] | null,
                publisherName: publisher.displayName,
                publisherSlug: publisher.slug,
                publisherVerified: publisher.isVerified,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="animate-fade-in flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.06] py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03]">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="mt-4 text-[15px] font-semibold text-text-secondary">
            No published agents yet
          </h3>
        </div>
      )}
    </div>
  );
}
