import { z } from "zod";
import { eq, and, desc, asc, sql, ilike, or } from "drizzle-orm";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { agents, publishers, stars, installs, teamAgents, teams } from "@/lib/db/schema";
import { divisions, runtimes } from "@orderly-agents/agent-schema";
import { AgentSpecSchema } from "@orderly-agents/agent-schema";

export const agentsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        division: z.enum([...divisions, "all"]).default("all"),
        runtime: z.enum([...runtimes, "all"]).default("all"),
        search: z.string().optional(),
        sortBy: z
          .enum(["stars", "installs", "newest", "trending"])
          .default("trending"),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(24),
      })
    )
    .query(async ({ ctx, input }) => {
      const { division, runtime, search, sortBy, page, limit } = input;
      const offset = (page - 1) * limit;

      const conditions = [eq(agents.status, "approved")];
      if (division !== "all") {
        conditions.push(eq(agents.division, division));
      }
      if (runtime !== "all") {
        conditions.push(eq(agents.runtime, runtime));
      }
      if (search) {
        conditions.push(
          or(
            ilike(agents.name, `%${search}%`),
            ilike(agents.description, `%${search}%`)
          )!
        );
      }

      const orderBy =
        sortBy === "stars"
          ? desc(agents.starCount)
          : sortBy === "installs"
            ? desc(agents.installCount)
            : sortBy === "newest"
              ? desc(agents.createdAt)
              : desc(agents.starCount); // trending = stars for V1

      const [items, countResult] = await Promise.all([
        ctx.db
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
            publisherName: publishers.displayName,
            publisherSlug: publishers.slug,
            publisherVerified: publishers.isVerified,
          })
          .from(agents)
          .innerJoin(publishers, eq(agents.publisherId, publishers.id))
          .where(and(...conditions))
          .orderBy(orderBy)
          .limit(limit)
          .offset(offset),
        ctx.db
          .select({ count: sql<number>`count(*)` })
          .from(agents)
          .where(and(...conditions)),
      ]);

      return {
        items,
        total: Number(countResult[0]?.count ?? 0),
        page,
        totalPages: Math.ceil(Number(countResult[0]?.count ?? 0) / limit),
      };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.agents.findFirst({
        where: eq(agents.slug, input.slug),
        with: {
          publisher: true,
          reviews: true,
        },
      });

      if (!result) return null;

      const relatedAgents = await ctx.db
        .select({
          id: agents.id,
          name: agents.name,
          slug: agents.slug,
          description: agents.description,
          division: agents.division,
          runtime: agents.runtime,
          iconEmoji: agents.iconEmoji,
          starCount: agents.starCount,
        })
        .from(agents)
        .where(
          and(
            eq(agents.division, result.division),
            eq(agents.status, "approved"),
            sql`${agents.id} != ${result.id}`
          )
        )
        .limit(4);

      const teamsUsing = await ctx.db
        .select({
          teamId: teams.id,
          teamName: teams.displayName,
          teamSlug: teams.slug,
          teamLogoColor: teams.logoColor,
        })
        .from(teamAgents)
        .innerJoin(teams, eq(teamAgents.teamId, teams.id))
        .where(eq(teamAgents.agentId, result.id));

      let isStarred = false;
      if (ctx.walletAddress) {
        const star = await ctx.db.query.stars.findFirst({
          where: and(
            eq(stars.agentId, result.id),
            eq(stars.walletAddress, ctx.walletAddress)
          ),
        });
        isStarred = !!star;
      }

      return { ...result, relatedAgents, teamsUsing, isStarred };
    }),

  submit: protectedProcedure
    .input(AgentSpecSchema)
    .mutation(async ({ ctx, input }) => {
      const publisher = await ctx.db.query.publishers.findFirst({
        where: eq(publishers.walletAddress, ctx.walletAddress),
      });

      if (!publisher) {
        throw new Error("Register as a publisher first");
      }

      const slug = input.name;
      const [agent] = await ctx.db
        .insert(agents)
        .values({
          name: input.name,
          slug,
          publisherId: publisher.id,
          version: input.version,
          division: input.division,
          runtime: input.runtime,
          riskLevel: input.riskLevel,
          status: "pending_review",
          description: input.description,
          longDescription: input.longDescription,
          supportedChains: input.supportedChains,
          brokerCompatibility: input.brokerCompatibility,
          orderlySDKVersion: input.orderlySDKVersion,
          mcpServerUrl: input.mcpServerUrl,
          hostedEndpoint: input.hostedEndpoint,
          sourceRepoUrl: input.sourceRepoUrl,
          tags: input.tags,
          configSchema: input.configSchema,
        })
        .returning();

      return agent;
    }),

  star: protectedProcedure
    .input(z.object({ agentId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.stars.findFirst({
        where: and(
          eq(stars.agentId, input.agentId),
          eq(stars.walletAddress, ctx.walletAddress)
        ),
      });

      if (existing) {
        await ctx.db.delete(stars).where(eq(stars.id, existing.id));
        await ctx.db
          .update(agents)
          .set({ starCount: sql`${agents.starCount} - 1` })
          .where(eq(agents.id, input.agentId));
        return { starred: false };
      }

      await ctx.db.insert(stars).values({
        agentId: input.agentId,
        walletAddress: ctx.walletAddress,
      });
      await ctx.db
        .update(agents)
        .set({ starCount: sql`${agents.starCount} + 1` })
        .where(eq(agents.id, input.agentId));
      return { starred: true };
    }),

  install: protectedProcedure
    .input(
      z.object({
        agentId: z.string().uuid(),
        runtime: z.enum(["skill", "mcp", "hosted"]),
        config: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(installs)
        .values({
          agentId: input.agentId,
          walletAddress: ctx.walletAddress,
          runtime: input.runtime,
          config: input.config,
        })
        .onConflictDoUpdate({
          target: [installs.agentId, installs.walletAddress],
          set: { isActive: true, lastUsedAt: new Date() },
        });

      await ctx.db
        .update(agents)
        .set({ installCount: sql`${agents.installCount} + 1` })
        .where(eq(agents.id, input.agentId));

      const agent = await ctx.db.query.agents.findFirst({
        where: eq(agents.id, input.agentId),
      });

      return {
        installed: true,
        skillFileUrl: agent?.skillFileUrl,
        mcpServerUrl: agent?.mcpServerUrl,
      };
    }),

  stats: publicProcedure.query(async ({ ctx }) => {
    const [agentCount, installCount, teamCount, publisherCount] =
      await Promise.all([
        ctx.db
          .select({ count: sql<number>`count(*)` })
          .from(agents)
          .where(eq(agents.status, "approved")),
        ctx.db
          .select({ total: sql<number>`coalesce(sum(${agents.installCount}), 0)` })
          .from(agents),
        ctx.db.select({ count: sql<number>`count(*)` }).from(teams),
        ctx.db.select({ count: sql<number>`count(*)` }).from(publishers),
      ]);

    return {
      totalAgents: Number(agentCount[0]?.count ?? 0),
      totalInstalls: Number(installCount[0]?.total ?? 0),
      activeTeams: Number(teamCount[0]?.count ?? 0),
      contributors: Number(publisherCount[0]?.count ?? 0),
    };
  }),
});
