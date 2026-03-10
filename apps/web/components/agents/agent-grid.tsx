import { AgentCard } from "./agent-card";

interface AgentGridProps {
  agents: Array<{
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
    publisherName: string;
    publisherSlug: string;
    publisherVerified: boolean | null;
  }>;
}

export function AgentGrid({ agents }: AgentGridProps) {
  if (agents.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
