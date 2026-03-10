"use client";

import { AgentCard } from "@/components/agents/agent-card";

interface RosterAgent {
  id: string;
  slug: string;
  name: string;
  description: string;
  division: string;
  runtime: "skill" | "mcp" | "hosted" | "hybrid";
  riskLevel: "low" | "medium" | "high" | "degen";
  iconEmoji: string | null;
  tags: string[] | null;
  starCount: number | null;
  installCount: number | null;
  isFeatured: boolean | null;
  displayOrder: number | null;
  publisherName: string;
  publisherSlug: string;
  publisherVerified: boolean | null;
}

export function TeamRoster({ agents }: { agents: RosterAgent[] }) {
  const featured = agents.filter((a) => a.isFeatured);
  const rest = agents.filter((a) => !a.isFeatured);

  return (
    <div className="space-y-8">
      {featured.length > 0 && (
        <div>
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
            Featured
          </h3>
          <div className="stagger-children grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div>
          {featured.length > 0 && (
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
              All Agents
            </h3>
          )}
          <div className="stagger-children grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
