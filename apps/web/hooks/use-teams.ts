"use client";

import { trpc } from "@/lib/trpc/client";

export function useTeamList(tier: string = "all") {
  return trpc.teams.list.useQuery({
    tier: tier as "all",
    page: 1,
    limit: 20,
  });
}

export function useTeamBySlug(slug: string) {
  return trpc.teams.getBySlug.useQuery({ slug });
}

export function useTeamAddAgent() {
  const utils = trpc.useUtils();
  return trpc.teams.addAgent.useMutation({
    onSuccess: () => {
      utils.teams.list.invalidate();
      utils.teams.getBySlug.invalidate();
    },
  });
}

export function useTeamRemoveAgent() {
  const utils = trpc.useUtils();
  return trpc.teams.removeAgent.useMutation({
    onSuccess: () => {
      utils.teams.list.invalidate();
      utils.teams.getBySlug.invalidate();
    },
  });
}
