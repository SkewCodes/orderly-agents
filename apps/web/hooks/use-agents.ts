"use client";

import { trpc } from "@/lib/trpc/client";

export function useAgentList(filters: {
  division: string;
  runtime: string;
  search: string;
  sortBy: string;
  page: number;
}) {
  return trpc.agents.list.useQuery({
    division: filters.division as "all",
    runtime: filters.runtime as "all",
    search: filters.search || undefined,
    sortBy: filters.sortBy as "trending",
    page: filters.page,
    limit: 24,
  });
}

export function useAgentBySlug(slug: string) {
  return trpc.agents.getBySlug.useQuery({ slug });
}

export function useAgentStar() {
  const utils = trpc.useUtils();
  return trpc.agents.star.useMutation({
    onSuccess: () => {
      utils.agents.list.invalidate();
      utils.agents.getBySlug.invalidate();
    },
  });
}

export function useAgentInstall() {
  const utils = trpc.useUtils();
  return trpc.agents.install.useMutation({
    onSuccess: () => {
      utils.agents.list.invalidate();
      utils.agents.getBySlug.invalidate();
    },
  });
}

export function useAgentStats() {
  return trpc.agents.stats.useQuery();
}
