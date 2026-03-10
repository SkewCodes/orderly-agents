import { z } from "zod";
import { eq, and, desc, sql, asc } from "drizzle-orm";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { teams, teamAgents, agents, publishers } from "@/lib/db/schema";
import { brokerTiers } from "@orderly-agents/agent-schema";

export const teamsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        tier: z.enum([...brokerTiers, "all"]).default("all"),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const { tier, page, limit } = input;
      const offset = (page - 1) * limit;

      const conditions = [eq(teams.isPublic, true)];
      if (tier !== "all") {
        conditions.push(eq(teams.tier, tier));
      }

      const teamList = await ctx.db
        .select()
        .from(teams)
        .where(and(...conditions))
        .orderBy(desc(teams.agentCount))
        .limit(limit)
        .offset(offset);

      const teamsWithAgents = await Promise.all(
        teamList.map(async (team) => {
          const agentPreviews = await ctx.db
            .select({
              id: agents.id,
              name: agents.name,
              slug: agents.slug,
              iconEmoji: agents.iconEmoji,
              runtime: agents.runtime,
              description: agents.description,
            })
            .from(teamAgents)
            .innerJoin(agents, eq(teamAgents.agentId, agents.id))
            .where(eq(teamAgents.teamId, team.id))
            .orderBy(asc(teamAgents.displayOrder))
            .limit(5);

          return { ...team, agents: agentPreviews };
        })
      );

      return teamsWithAgents;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const team = await ctx.db.query.teams.findFirst({
        where: eq(teams.slug, input.slug),
      });

      if (!team) return null;

      const roster = await ctx.db
        .select({
          id: agents.id,
          name: agents.name,
          slug: agents.slug,
          description: agents.description,
          division: agents.division,
          runtime: agents.runtime,
          riskLevel: agents.riskLevel,
          iconEmoji: agents.iconEmoji,
          tags: agents.tags,
          starCount: agents.starCount,
          installCount: agents.installCount,
          isFeatured: teamAgents.isFeatured,
          displayOrder: teamAgents.displayOrder,
          publisherName: publishers.displayName,
          publisherSlug: publishers.slug,
          publisherVerified: publishers.isVerified,
        })
        .from(teamAgents)
        .innerJoin(agents, eq(teamAgents.agentId, agents.id))
        .innerJoin(publishers, eq(agents.publisherId, publishers.id))
        .where(eq(teamAgents.teamId, team.id))
        .orderBy(asc(teamAgents.displayOrder));

      return { ...team, roster };
    }),

  addAgent: protectedProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
        agentId: z.string().uuid(),
        config: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.db.query.teams.findFirst({
        where: eq(teams.id, input.teamId),
      });
      if (!team || team.ownerWallet !== ctx.walletAddress) {
        throw new Error("Not authorized to manage this team");
      }

      await ctx.db.insert(teamAgents).values({
        teamId: input.teamId,
        agentId: input.agentId,
        addedBy: ctx.walletAddress,
        agentConfig: input.config,
      });

      await ctx.db
        .update(teams)
        .set({ agentCount: sql`${teams.agentCount} + 1` })
        .where(eq(teams.id, input.teamId));

      return { added: true };
    }),

  removeAgent: protectedProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
        agentId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.db.query.teams.findFirst({
        where: eq(teams.id, input.teamId),
      });
      if (!team || team.ownerWallet !== ctx.walletAddress) {
        throw new Error("Not authorized to manage this team");
      }

      await ctx.db
        .delete(teamAgents)
        .where(
          and(
            eq(teamAgents.teamId, input.teamId),
            eq(teamAgents.agentId, input.agentId)
          )
        );

      await ctx.db
        .update(teams)
        .set({ agentCount: sql`${teams.agentCount} - 1` })
        .where(eq(teams.id, input.teamId));

      return { removed: true };
    }),

  reorder: protectedProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
        agentIds: z.array(z.string().uuid()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.db.query.teams.findFirst({
        where: eq(teams.id, input.teamId),
      });
      if (!team || team.ownerWallet !== ctx.walletAddress) {
        throw new Error("Not authorized to manage this team");
      }

      await Promise.all(
        input.agentIds.map((agentId, idx) =>
          ctx.db
            .update(teamAgents)
            .set({ displayOrder: idx })
            .where(
              and(
                eq(teamAgents.teamId, input.teamId),
                eq(teamAgents.agentId, agentId)
              )
            )
        )
      );

      return { reordered: true };
    }),
});
