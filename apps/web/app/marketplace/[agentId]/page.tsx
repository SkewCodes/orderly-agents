import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { serverCaller } from "@/lib/trpc/server";
import { AgentDetailClient } from "./client";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { getMockAgentDetail } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ agentId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { agentId } = await params;
  try {
    const caller = await serverCaller();
    const agent = await caller.agents.getBySlug({ slug: agentId });
    if (!agent) throw new Error("not found");
    return {
      title: agent.name,
      description: agent.description,
      openGraph: {
        title: `${agent.name} — OrderlyAgents`,
        description: agent.description,
      },
    };
  } catch {
    const mock = getMockAgentDetail(agentId);
    if (mock) return { title: mock.name, description: mock.description };
    return { title: "Agent Marketplace" };
  }
}

export default async function AgentDetailPage({ params }: Props) {
  const { agentId } = await params;

  let agent;
  try {
    const caller = await serverCaller();
    agent = await caller.agents.getBySlug({ slug: agentId });
  } catch {
    agent = null;
  }

  if (!agent) {
    const mock = getMockAgentDetail(agentId);
    if (!mock) notFound();
    agent = mock;
  }

  if (!agent) notFound();

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Marketplace", href: "/marketplace" },
          { label: agent.name },
        ]}
      />
      <AgentDetailClient agent={agent as any} />
    </div>
  );
}
