"use client";

import { AgentDetail } from "@/components/agents/agent-detail";
import { Reviews } from "@/components/agents/reviews";

type AgentDetailProps = Parameters<typeof AgentDetail>[0];

export function AgentDetailClient(props: AgentDetailProps) {
  return (
    <>
      <AgentDetail {...props} />
      <div className="mt-12 border-t border-white/[0.04] pt-12">
        <Reviews agentId={props.agent.id} agentName={props.agent.name} />
      </div>
    </>
  );
}
