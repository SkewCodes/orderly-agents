import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { publishers, agents } from "@/lib/db/schema";

export const publishersRouter = router({
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const publisher = await ctx.db.query.publishers.findFirst({
        where: eq(publishers.slug, input.slug),
        with: {
          agents: {
            where: eq(agents.status, "approved"),
          },
        },
      });

      if (!publisher) return null;

      const stats = await ctx.db
        .select({
          totalInstalls: sql<number>`coalesce(sum(${agents.installCount}), 0)`,
          totalStars: sql<number>`coalesce(sum(${agents.starCount}), 0)`,
          agentCount: sql<number>`count(*)`,
        })
        .from(agents)
        .where(eq(agents.publisherId, publisher.id));

      return {
        ...publisher,
        totalInstalls: Number(stats[0]?.totalInstalls ?? 0),
        totalStars: Number(stats[0]?.totalStars ?? 0),
        agentCount: Number(stats[0]?.agentCount ?? 0),
      };
    }),

  register: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(100),
        slug: z
          .string()
          .min(2)
          .max(100)
          .regex(/^[a-z0-9-]+$/, "Must be kebab-case"),
        description: z.string().optional(),
        websiteUrl: z.string().url().optional(),
        githubOrg: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.publishers.findFirst({
        where: eq(publishers.walletAddress, ctx.walletAddress),
      });
      if (existing) {
        throw new Error("Publisher profile already exists for this wallet");
      }

      const [publisher] = await ctx.db
        .insert(publishers)
        .values({
          name: input.name,
          slug: input.slug,
          walletAddress: ctx.walletAddress,
          displayName: input.name,
          description: input.description,
          websiteUrl: input.websiteUrl,
          githubOrg: input.githubOrg,
        })
        .returning();

      return publisher;
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.publishers.findFirst({
      where: eq(publishers.walletAddress, ctx.walletAddress),
    });
  }),
});
