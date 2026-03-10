import { z } from "zod";

export const divisions = [
  "trading",
  "building",
  "analytics",
  "social",
  "infra",
  "starchild",
] as const;

export const runtimes = ["skill", "mcp", "hosted", "hybrid"] as const;

export const riskLevels = ["low", "medium", "high", "degen"] as const;

export const AgentSpecSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Must be kebab-case"),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Must be semver"),
  description: z.string().min(20).max(500),
  division: z.enum(divisions),
  runtime: z.enum(runtimes),

  author: z.string().min(1).max(100),
  authorWallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),

  riskLevel: z.enum(riskLevels).default("low"),
  supportedChains: z.array(z.string()).default(["all"]),
  brokerCompatibility: z.string().default("all"),
  orderlySDKVersion: z.string().optional(),

  mcpServerUrl: z.string().url().optional(),
  hostedEndpoint: z.string().url().optional(),
  sourceRepoUrl: z.string().url().optional(),

  tags: z.array(z.string().max(30)).max(10).default([]),
  longDescription: z.string().max(10000).optional(),

  configSchema: z.record(z.unknown()).optional(),

  license: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type AgentSpec = z.infer<typeof AgentSpecSchema>;

export function validateAgentSpec(spec: AgentSpec): string[] {
  const errors: string[] = [];

  if (spec.runtime === "mcp" && !spec.mcpServerUrl) {
    errors.push("MCP agents must provide mcpServerUrl");
  }
  if (spec.runtime === "hosted" && !spec.hostedEndpoint) {
    errors.push("Hosted agents must provide hostedEndpoint");
  }
  if (spec.riskLevel === "high" || spec.riskLevel === "degen") {
    if (!spec.configSchema) {
      errors.push(
        "High/degen risk agents must provide configSchema with safety parameters"
      );
    }
  }
  if (spec.division === "trading" && !spec.supportedChains?.length) {
    errors.push("Trading agents must specify supported chains");
  }

  return errors;
}
