import { z } from "zod";

export const PublisherSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Must be kebab-case"),
  description: z.string().max(1000).optional(),
  websiteUrl: z.string().url().optional(),
  twitterHandle: z.string().max(50).optional(),
  githubOrg: z.string().max(100).optional(),
});

export type PublisherSpec = z.infer<typeof PublisherSchema>;
