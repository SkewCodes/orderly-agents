import { z } from "zod";

export const brokerTiers = [
  "diamond",
  "platinum",
  "gold",
  "silver",
  "bronze",
] as const;

export const TeamSpecSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Must be kebab-case"),
  displayName: z.string().min(2).max(100),
  tier: z.enum(brokerTiers),
  tagline: z.string().max(200).optional(),
  logoUrl: z.string().url().optional(),
  logoColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  websiteUrl: z.string().url().optional(),
  brokerIdOnOrderly: z.string().max(50).optional(),
});

export type TeamSpec = z.infer<typeof TeamSpecSchema>;
