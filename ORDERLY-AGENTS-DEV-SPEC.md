# OrderlyAgents — Development Specification

> **Purpose**: This document is the single source of truth for building OrderlyAgents. It is designed to be loaded as project context in Cursor AI (Claude Opus 4.6). Every architectural decision, schema, route, and component is specified here. Follow it precisely.

---

## 0. Engineering Context

You are a senior engineer specializing in crypto applications. You have deep experience with:

- DeFi protocol architecture (CLOBs, AMMs, perps, orderbook systems)
- Onchain + offchain hybrid systems (Orderly Network's model: offchain matching engine, onchain settlement)
- Production TypeScript/React/Next.js applications in Web3
- Smart contract integration (Solidity, ethers.js/viem, wagmi)
- Agent/AI infrastructure (MCP protocol, Claude Skills, autonomous execution runtimes)
- Real-time WebSocket systems for trading data
- Multi-chain deployment (EVM chains: Arbitrum, Optimism, Base, Mantle, Polygon, etc.)

### Engineering Principles

1. **Ship incrementally** — working MVP first, polish later. Every PR should be deployable.
2. **Type everything** — zero `any` types. Use Zod for runtime validation at API boundaries.
3. **Fail loudly** — no silent catches. Errors propagate to user-facing feedback or structured logs.
4. **Crypto-native UX** — wallet-first auth, chain-aware components, gas-conscious flows. No email/password.
5. **Composable by default** — every module should work standalone and as part of the larger system.
6. **Security paranoia** — never trust client input, never expose private keys in env, never store secrets in the DB. Agent execution is sandboxed.
7. **Dependency hygiene** — avoid React 19.0.0–19.2.0 and Next.js 14.3.0-canary.77 through unpatched releases (CVE-2025-55182). Use React 19.0.1+/19.1.2+/19.2.1+ and Next.js 16.0.7+ or later.

---

## 1. Product Overview

### What Is OrderlyAgents?

An open marketplace where anyone in the Orderly ecosystem can publish, discover, and deploy AI agents that plug into Orderly's shared infrastructure. The differentiator: every agent shares a common backend — the Orderly CLOB and SDK — so agents are interoperable across all Orderly-powered DEXes by default.

### Core Feature: Agent Teams

Every Orderly-powered DEX (WOOFi, LogX, any DEX Builder deployment) can curate a **team** of agents from the marketplace. This is the killer page — it shows which AI capabilities a DEX has assembled. Traders pick a DEX partially based on its agent team. DEX operators shop the marketplace to differentiate.

### Users

| User Type | What They Do | Primary Actions |
|-----------|-------------|-----------------|
| **Traders** | Use agents to automate strategies on Orderly DEXes | Browse, install, configure, run agents |
| **Builders/Devs** | Create and publish agents | Submit agents, manage listings, track installs |
| **Brokers/DEX Operators** | Curate agent teams for their frontends | Assemble teams, feature agents, manage access |
| **Ecosystem Partners** | Publish branded agent suites (Starchild, WOO) | Manage publisher profile, publish agent collections |

### Relationship to Orderly Ecosystem

| Product | Relationship to OrderlyAgents |
|---------|-------------------------------|
| **Orderly Social** | Reputation layer — agent creators earn Builder Points (OBP), agent usage feeds leaderboards |
| **Orderly Builders** | Supply side — bounties can require "publish an agent" as deliverable |
| **Velocity** | Primary use case for Tier 3 agents — graduation snipe bots, automated listing agents |
| **DEX Builder** | Distribution surface — agents are installable modules for DEX Builder deployments |
| **Orderly MCP Server** | Universal connector — Tier 2 agents connect via MCP to the Orderly SDK |
| **Starchild AI** | Ecosystem partner publisher — Starchild vibe-coding agents are listed on the marketplace |
| **WOO Network** | Ecosystem partner publisher — WOO market making and liquidity agents are listed |

---

## 2. Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                        OrderlyAgents                            │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  Marketplace  │  │  Agent Teams │  │   Publisher Portal    │  │
│  │  (Discovery)  │  │  (DEX Pages) │  │   (Agent Mgmt)       │  │
│  └──────┬───────┘  └──────┬───────┘  └───────────┬───────────┘  │
│         │                 │                       │              │
│  ┌──────┴─────────────────┴───────────────────────┴───────────┐  │
│  │                     API Layer (tRPC)                        │  │
│  └──────────────────────────┬─────────────────────────────────┘  │
│                             │                                    │
│  ┌──────────────────────────┴─────────────────────────────────┐  │
│  │                    Agent Registry (DB)                      │  │
│  │  agents / teams / publishers / installs / reviews           │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  Tier 1:    │  │  Tier 2:     │  │  Tier 3:             │   │
│  │  Skills     │  │  MCP Servers │  │  Hosted Execution    │   │
│  │  (Download) │  │  (Connect)   │  │  (Autonomous)        │   │
│  └─────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                   ┌──────────┴──────────┐
                   │   Orderly Network   │
                   │   Shared CLOB +     │
                   │   Settlement Layer  │
                   └─────────────────────┘
```

### Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Next.js 16+ (App Router) | SSR for SEO on agent listings, RSC for data-heavy pages |
| **Language** | TypeScript (strict mode) | Non-negotiable for a crypto app |
| **Styling** | Tailwind CSS 4+ | Utility-first, consistent with Orderly ecosystem |
| **UI Components** | shadcn/ui + Radix primitives | Accessible, unstyled, composable |
| **State Management** | Zustand + React Query (TanStack) | Zustand for client state, React Query for server cache |
| **API** | tRPC v11 | End-to-end type safety, no codegen |
| **Database** | PostgreSQL (Supabase or Neon) | Relational data, JSONB for agent metadata, full-text search |
| **ORM** | Drizzle ORM | Type-safe, lightweight, SQL-first |
| **Auth** | SIWE (Sign-In With Ethereum) via wagmi/viem | Wallet-native, no email/password |
| **File Storage** | Cloudflare R2 or S3 | Agent skill files, MCP server bundles |
| **Realtime** | Supabase Realtime or Ably | Live install counts, agent status updates |
| **Search** | PostgreSQL full-text + pg_trgm | V1 search. Upgrade to Typesense/Meilisearch if needed |
| **Deployment** | Vercel (frontend) + Fly.io or Railway (Tier 3 runtime) | Edge-first frontend, dedicated compute for hosted agents |
| **Monitoring** | Sentry + Axiom | Error tracking + structured logging |
| **Chain Interaction** | viem + wagmi v2 | Modern, typed Ethereum libraries |

### Directory Structure

```
orderly-agents/
├── apps/
│   └── web/                          # Next.js 16 application
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx              # Landing — redirects to /teams
│       │   ├── teams/
│       │   │   ├── page.tsx          # Agent Teams directory
│       │   │   └── [teamId]/
│       │   │       └── page.tsx      # Individual team page
│       │   ├── marketplace/
│       │   │   ├── page.tsx          # Agent marketplace browser
│       │   │   └── [agentId]/
│       │   │       └── page.tsx      # Agent detail page
│       │   ├── publish/
│       │   │   └── page.tsx          # Agent submission flow
│       │   ├── publisher/
│       │   │   └── [publisherId]/
│       │   │       └── page.tsx      # Publisher profile (Starchild, WOO, etc.)
│       │   └── api/
│       │       └── trpc/
│       │           └── [trpc]/
│       │               └── route.ts  # tRPC API handler
│       ├── components/
│       │   ├── agents/
│       │   │   ├── agent-card.tsx
│       │   │   ├── agent-detail.tsx
│       │   │   ├── agent-grid.tsx
│       │   │   ├── runtime-badge.tsx
│       │   │   ├── risk-indicator.tsx
│       │   │   └── division-filter.tsx
│       │   ├── teams/
│       │   │   ├── team-card.tsx
│       │   │   ├── team-roster.tsx
│       │   │   ├── team-builder.tsx   # Drag-and-drop team assembly
│       │   │   └── team-stats.tsx
│       │   ├── publishers/
│       │   │   ├── publisher-card.tsx
│       │   │   └── publisher-badge.tsx
│       │   ├── layout/
│       │   │   ├── header.tsx
│       │   │   ├── sidebar.tsx
│       │   │   └── footer.tsx
│       │   └── shared/
│       │       ├── wallet-connect.tsx
│       │       ├── chain-selector.tsx
│       │       ├── search-bar.tsx
│       │       └── loading-states.tsx
│       ├── lib/
│       │   ├── trpc/
│       │   │   ├── client.ts
│       │   │   ├── server.ts
│       │   │   └── router.ts
│       │   ├── db/
│       │   │   ├── schema.ts         # Drizzle schema
│       │   │   ├── migrations/
│       │   │   └── seed.ts
│       │   ├── orderly/
│       │   │   ├── sdk.ts            # Orderly SDK wrapper
│       │   │   ├── types.ts
│       │   │   └── constants.ts
│       │   ├── auth/
│       │   │   └── siwe.ts           # SIWE auth logic
│       │   ├── agents/
│       │   │   ├── schema.ts         # Zod schemas for agent specs
│       │   │   ├── parser.ts         # Parse SKILL.md / agent.yaml
│       │   │   ├── validator.ts      # Validate agent submissions
│       │   │   └── runtime.ts        # Runtime tier detection
│       │   └── utils/
│       │       ├── format.ts
│       │       └── chains.ts
│       └── hooks/
│           ├── use-agents.ts
│           ├── use-teams.ts
│           ├── use-wallet.ts
│           └── use-orderly.ts
├── packages/
│   ├── agent-schema/                 # Shared agent spec types + validation
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── agent.ts              # AgentSpec Zod schema
│   │   │   ├── team.ts               # TeamSpec Zod schema
│   │   │   └── publisher.ts
│   │   └── package.json
│   └── orderly-mcp/                  # Orderly MCP server (Tier 2 backbone)
│       ├── src/
│       │   ├── server.ts
│       │   ├── tools/
│       │   │   ├── orderbook.ts
│       │   │   ├── trading.ts
│       │   │   ├── account.ts
│       │   │   └── market-data.ts
│       │   └── types.ts
│       └── package.json
├── agents/                            # Seed agents (ship with V1)
│   ├── trading/
│   │   ├── graduation-sniper/
│   │   │   ├── SKILL.md
│   │   │   └── scripts/
│   │   ├── clob-market-maker/
│   │   │   ├── SKILL.md
│   │   │   └── scripts/
│   │   ├── copy-trade-engine/
│   │   │   └── SKILL.md
│   │   └── liquidation-hunter/
│   │       └── SKILL.md
│   ├── building/
│   │   ├── contract-deployer/
│   │   │   ├── SKILL.md
│   │   │   └── references/
│   │   └── sdk-assistant/
│   │       └── SKILL.md
│   ├── analytics/
│   │   ├── orderbook-analyst/
│   │   │   └── SKILL.md
│   │   └── whale-watcher/
│   │       └── SKILL.md
│   ├── social/
│   │   ├── leaderboard-engine/
│   │   │   └── SKILL.md
│   │   └── quest-designer/
│   │       └── SKILL.md
│   ├── starchild/
│   │   ├── dex-vibe-coder/
│   │   │   └── SKILL.md
│   │   ├── theme-agent/
│   │   │   └── SKILL.md
│   │   └── analytics-module/
│   │       └── SKILL.md
│   └── infra/
│       └── bridge-monitor/
│           └── SKILL.md
├── drizzle.config.ts
├── turbo.json
├── package.json
└── .env.example
```

---

## 3. Data Models

### Database Schema (Drizzle ORM)

```typescript
// lib/db/schema.ts

import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, pgEnum, uuid, index, uniqueIndex } from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────

export const divisionEnum = pgEnum("division", [
  "trading",
  "building",
  "analytics",
  "social",
  "infra",
  "starchild",
]);

export const runtimeEnum = pgEnum("runtime", [
  "skill",    // Tier 1: downloadable SKILL.md
  "mcp",      // Tier 2: MCP server connector
  "hosted",   // Tier 3: autonomous server-side execution
  "hybrid",   // Multiple runtimes
]);

export const riskEnum = pgEnum("risk_level", [
  "low",
  "medium",
  "high",
  "degen",
]);

export const tierEnum = pgEnum("broker_tier", [
  "diamond",
  "platinum",
  "gold",
  "silver",
  "bronze",
]);

export const agentStatusEnum = pgEnum("agent_status", [
  "draft",
  "pending_review",
  "approved",
  "rejected",
  "deprecated",
]);

// ─── Publishers ───────────────────────────────────────────

export const publishers = pgTable("publishers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  walletAddress: varchar("wallet_address", { length: 42 }).notNull(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  description: text("description"),
  avatarUrl: text("avatar_url"),
  websiteUrl: text("website_url"),
  twitterHandle: varchar("twitter_handle", { length: 50 }),
  githubOrg: varchar("github_org", { length: 100 }),
  isVerified: boolean("is_verified").default(false),          // Starchild, WOO, orderly-core
  isEcosystemPartner: boolean("is_ecosystem_partner").default(false),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("publishers_slug_idx").on(table.slug),
  index("publishers_wallet_idx").on(table.walletAddress),
]);

// ─── Agents ───────────────────────────────────────────────

export const agents = pgTable("agents", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  publisherId: uuid("publisher_id").references(() => publishers.id).notNull(),
  version: varchar("version", { length: 20 }).notNull().default("1.0.0"),
  division: divisionEnum("division").notNull(),
  runtime: runtimeEnum("runtime").notNull(),
  riskLevel: riskEnum("risk_level").notNull().default("low"),
  status: agentStatusEnum("status").notNull().default("draft"),

  // Content
  description: text("description").notNull(),
  longDescription: text("long_description"),              // Markdown — rendered on detail page
  iconEmoji: varchar("icon_emoji", { length: 10 }),
  thumbnailUrl: text("thumbnail_url"),

  // Technical
  supportedChains: jsonb("supported_chains").$type<string[]>().default([]),   // ["arbitrum", "optimism", "base"]
  brokerCompatibility: varchar("broker_compatibility", { length: 20 }).default("all"), // "all" or comma-separated broker IDs
  orderlySDKVersion: varchar("orderly_sdk_version", { length: 20 }),
  mcpServerUrl: text("mcp_server_url"),                   // For Tier 2 agents
  skillFileUrl: text("skill_file_url"),                   // R2/S3 URL for Tier 1 skill zip
  hostedEndpoint: text("hosted_endpoint"),                // For Tier 3 agents
  sourceRepoUrl: text("source_repo_url"),                 // GitHub link

  // Discovery
  tags: jsonb("tags").$type<string[]>().default([]),
  searchVector: text("search_vector"),                    // tsvector for full-text search

  // Stats (denormalized for fast reads)
  starCount: integer("star_count").default(0),
  installCount: integer("install_count").default(0),
  activeInstances: integer("active_instances").default(0), // For hosted agents

  // Config schema — defines what users can configure when installing
  configSchema: jsonb("config_schema").$type<Record<string, unknown>>(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
}, (table) => [
  uniqueIndex("agents_slug_idx").on(table.slug),
  index("agents_division_idx").on(table.division),
  index("agents_runtime_idx").on(table.runtime),
  index("agents_publisher_idx").on(table.publisherId),
  index("agents_status_idx").on(table.status),
]);

// ─── Teams (DEX Agent Teams) ──────────────────────────────

export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  ownerWallet: varchar("owner_wallet", { length: 42 }).notNull(),
  tier: tierEnum("tier").notNull().default("bronze"),

  // Branding
  displayName: varchar("display_name", { length: 100 }).notNull(),
  tagline: text("tagline"),
  logoUrl: text("logo_url"),
  logoColor: varchar("logo_color", { length: 7 }),        // hex color
  websiteUrl: text("website_url"),
  brokerIdOnOrderly: varchar("broker_id", { length: 50 }), // Links to actual Orderly broker

  // Stats (denormalized)
  memberCount: integer("member_count").default(0),
  totalVolume: varchar("total_volume", { length: 50 }),    // USD string
  agentCount: integer("agent_count").default(0),

  isVerified: boolean("is_verified").default(false),
  isPublic: boolean("is_public").default(true),

  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("teams_slug_idx").on(table.slug),
  index("teams_owner_idx").on(table.ownerWallet),
]);

// ─── Team ↔ Agent Junction ───────────────────────────────

export const teamAgents = pgTable("team_agents", {
  id: uuid("id").defaultRandom().primaryKey(),
  teamId: uuid("team_id").references(() => teams.id, { onDelete: "cascade" }).notNull(),
  agentId: uuid("agent_id").references(() => agents.id, { onDelete: "cascade" }).notNull(),
  addedBy: varchar("added_by", { length: 42 }).notNull(),  // wallet that added it
  isFeatured: boolean("is_featured").default(false),        // Pinned to top of team page
  displayOrder: integer("display_order").default(0),
  agentConfig: jsonb("agent_config").$type<Record<string, unknown>>(), // Team-specific config overrides
  addedAt: timestamp("added_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("team_agents_unique_idx").on(table.teamId, table.agentId),
  index("team_agents_team_idx").on(table.teamId),
]);

// ─── Installs (user ↔ agent) ─────────────────────────────

export const installs = pgTable("installs", {
  id: uuid("id").defaultRandom().primaryKey(),
  agentId: uuid("agent_id").references(() => agents.id, { onDelete: "cascade" }).notNull(),
  walletAddress: varchar("wallet_address", { length: 42 }).notNull(),
  runtime: runtimeEnum("runtime").notNull(),               // Which tier they installed
  config: jsonb("config").$type<Record<string, unknown>>(),
  isActive: boolean("is_active").default(true),
  installedAt: timestamp("installed_at").defaultNow().notNull(),
  lastUsedAt: timestamp("last_used_at"),
}, (table) => [
  uniqueIndex("installs_unique_idx").on(table.agentId, table.walletAddress),
  index("installs_wallet_idx").on(table.walletAddress),
  index("installs_agent_idx").on(table.agentId),
]);

// ─── Stars (user ↔ agent) ────────────────────────────────

export const stars = pgTable("stars", {
  id: uuid("id").defaultRandom().primaryKey(),
  agentId: uuid("agent_id").references(() => agents.id, { onDelete: "cascade" }).notNull(),
  walletAddress: varchar("wallet_address", { length: 42 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("stars_unique_idx").on(table.agentId, table.walletAddress),
]);

// ─── Reviews ──────────────────────────────────────────────

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  agentId: uuid("agent_id").references(() => agents.id, { onDelete: "cascade" }).notNull(),
  walletAddress: varchar("wallet_address", { length: 42 }).notNull(),
  rating: integer("rating").notNull(),                     // 1-5
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("reviews_unique_idx").on(table.agentId, table.walletAddress),
]);
```

### Agent Spec Schema (Zod)

This is the canonical schema for agent submissions. It validates the YAML frontmatter and metadata that every agent must provide.

```typescript
// packages/agent-schema/src/agent.ts

import { z } from "zod";

export const AgentSpecSchema = z.object({
  // Required
  name: z.string()
    .min(3).max(60)
    .regex(/^[a-z0-9-]+$/, "Must be kebab-case"),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Must be semver"),
  description: z.string().min(20).max(500),
  division: z.enum(["trading", "building", "analytics", "social", "infra", "starchild"]),
  runtime: z.enum(["skill", "mcp", "hosted", "hybrid"]),

  // Author
  author: z.string().min(1).max(100),
  authorWallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),

  // Technical
  riskLevel: z.enum(["low", "medium", "high", "degen"]).default("low"),
  supportedChains: z.array(z.string()).default(["all"]),
  brokerCompatibility: z.string().default("all"),
  orderlySDKVersion: z.string().optional(),

  // Runtime-specific
  mcpServerUrl: z.string().url().optional(),              // Required if runtime is "mcp"
  hostedEndpoint: z.string().url().optional(),            // Required if runtime is "hosted"
  sourceRepoUrl: z.string().url().optional(),

  // Discovery
  tags: z.array(z.string().max(30)).max(10).default([]),
  longDescription: z.string().max(10000).optional(),      // Markdown

  // Config — JSON Schema defining what users can configure
  configSchema: z.record(z.unknown()).optional(),

  // Metadata
  license: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type AgentSpec = z.infer<typeof AgentSpecSchema>;

// Runtime-specific validation
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
      errors.push("High/degen risk agents must provide configSchema with safety parameters");
    }
  }
  if (spec.division === "trading" && !spec.supportedChains?.length) {
    errors.push("Trading agents must specify supported chains");
  }

  return errors;
}
```

---

## 4. Agent Runtime Tiers

### Tier 1 — Skills (Downloadable)

Agent is packaged as a Claude Skill folder (SKILL.md + optional scripts/ and references/). User downloads a .zip, uploads to Claude.ai Settings > Skills or places in `~/.claude/agents/` for Claude Code.

**Submission flow:**
1. Builder submits agent via form or GitHub PR
2. Agent passes schema validation
3. Skill file is stored in R2/S3
4. Listed on marketplace with "Skill" runtime badge
5. User clicks "Download" → gets .zip

**What Tier 1 agents can do:**
- Provide domain expertise and workflow guidance
- Generate code, documents, strategies
- Reference Orderly SDK patterns and contract interfaces
- Cannot access live data or execute trades (that's Tier 2/3)

**Example agents:** Quest Designer, Contract Deployer guide, Leaderboard Engine template

### Tier 2 — MCP Servers (Connectable)

Agent is an MCP server that connects to the Orderly SDK. User connects it in Claude.ai or any MCP-compatible client. The MCP server exposes tools (read orderbook, fetch positions, submit orders, etc.) and the agent's SKILL.md provides the workflow intelligence on top.

**Submission flow:**
1. Builder submits agent with MCP server URL
2. Platform validates MCP server is reachable and returns valid tool list
3. Listed on marketplace with "MCP" runtime badge
4. User clicks "Connect" → copies MCP server URL to Claude settings

**What Tier 2 agents can do:**
- Everything Tier 1 can do PLUS:
- Read live orderbook data
- Fetch account positions and balances
- Submit trades (with user confirmation in Claude)
- Query on-chain state

**The Orderly MCP Server (`packages/orderly-mcp/`) is the reference implementation.** It exposes these core tools:

```
orderly:getOrderbook      — Fetch L2 orderbook for any pair
orderly:getMarketData     — Ticker, 24h volume, funding rates
orderly:getPositions      — User's open positions
orderly:getBalances       — User's asset balances
orderly:placeOrder        — Submit limit/market order
orderly:cancelOrder       — Cancel an open order
orderly:getTradeHistory   — Recent fills
orderly:getAvailablePairs — List all trading pairs
```

Third-party MCP agents (Starchild, WOO) expose their own tools on their own MCP servers. OrderlyAgents just links to them.

**Example agents:** Orderbook Analyst, Starchild DEX Vibe Coder, Starchild Theme Agent

### Tier 3 — Hosted (Autonomous)

Agent runs server-side on OrderlyAgents infrastructure. Always-on, no human in the loop. User configures via the OrderlyAgents UI and the agent executes autonomously.

**This is V2 scope.** Do not build Tier 3 execution infrastructure for V1. The data model and UI should support it (status badges, config schema, active instances count) but the runtime is not shipped yet.

**What Tier 3 agents will do:**
- Everything Tier 2 can do PLUS:
- Execute continuously without user interaction
- Run on dedicated compute (containerized)
- Manage their own state (positions, PnL tracking)
- Respond to real-time events (WebSocket: graduation events, liquidation levels)

**Example agents:** Graduation Sniper, CLOB Market Maker, Copy Trade Engine, Liquidation Hunter

**V2 architecture notes (for future reference, do not implement now):**
- Each hosted agent runs in an isolated Docker container on Fly.io or Railway
- Agent communicates with Orderly SDK via API keys scoped to the user's account
- Kill switch: user can stop any hosted agent instantly from the UI
- Rate limits and position size caps enforced at the platform level
- PnL tracking and audit logs stored per agent instance

---

## 5. API Routes (tRPC)

```typescript
// Simplified router structure — implement each procedure with Drizzle queries

export const appRouter = router({
  // ─── Agents ──────────────────────────
  agents: router({
    list: publicProcedure
      .input(z.object({
        division: z.enum([...divisions, "all"]).optional(),
        runtime: z.enum([...runtimes, "all"]).optional(),
        search: z.string().optional(),
        sortBy: z.enum(["stars", "installs", "newest", "trending"]).default("trending"),
        page: z.number().default(1),
        limit: z.number().default(24),
      }))
      .query(/* paginated agent list with filters */),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(/* single agent with publisher, reviews, related agents */),

    submit: protectedProcedure
      .input(AgentSpecSchema)
      .mutation(/* create agent in draft status, validate, store files */),

    star: protectedProcedure
      .input(z.object({ agentId: z.string().uuid() }))
      .mutation(/* toggle star, update denormalized count */),

    install: protectedProcedure
      .input(z.object({
        agentId: z.string().uuid(),
        runtime: z.enum(["skill", "mcp", "hosted"]),
        config: z.record(z.unknown()).optional(),
      }))
      .mutation(/* record install, update count, return download/connect URL */),
  }),

  // ─── Teams ───────────────────────────
  teams: router({
    list: publicProcedure
      .input(z.object({
        tier: z.enum([...tiers, "all"]).optional(),
        page: z.number().default(1),
      }))
      .query(/* paginated team list with agent previews */),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(/* team with full agent roster, stats */),

    addAgent: protectedProcedure
      .input(z.object({
        teamId: z.string().uuid(),
        agentId: z.string().uuid(),
        config: z.record(z.unknown()).optional(),
      }))
      .mutation(/* add agent to team, verify wallet owns team */),

    removeAgent: protectedProcedure
      .input(z.object({
        teamId: z.string().uuid(),
        agentId: z.string().uuid(),
      }))
      .mutation(/* remove agent from team */),

    reorder: protectedProcedure
      .input(z.object({
        teamId: z.string().uuid(),
        agentIds: z.array(z.string().uuid()),
      }))
      .mutation(/* update display_order for all agents in team */),
  }),

  // ─── Publishers ──────────────────────
  publishers: router({
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(/* publisher profile with their agents */),

    register: protectedProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string().regex(/^[a-z0-9-]+$/),
        description: z.string().optional(),
        websiteUrl: z.string().url().optional(),
        githubOrg: z.string().optional(),
      }))
      .mutation(/* create publisher, link to wallet */),
  }),

  // ─── Auth ────────────────────────────
  auth: router({
    getNonce: publicProcedure.query(/* generate SIWE nonce */),
    verify: publicProcedure
      .input(z.object({ message: z.string(), signature: z.string() }))
      .mutation(/* verify SIWE signature, create/return session */),
    session: publicProcedure.query(/* return current session */),
  }),
});
```

---

## 6. Pages & Components

### Page: Agent Teams (`/teams`)

This is the **landing page** and primary view. It answers: "What AI capabilities does each DEX have?"

**Layout:**
- Hero section: "The AI layer for every Orderly-powered DEX"
- Grid of TeamCards — each shows DEX name, tier badge, stats (traders, volume, agent count), and a compact preview of their top 3 agents
- "Your DEX" CTA card — dashed border, funnels to DEX Builder
- Ecosystem Partners section at bottom — Starchild, WOO, Orderly Core, Community — showing how many agents each publishes

**TeamCard component data:**
```typescript
interface TeamCardProps {
  team: {
    name: string;
    slug: string;
    tier: "diamond" | "platinum" | "gold" | "silver" | "bronze";
    tagline: string;
    logoUrl: string;
    logoColor: string;
    memberCount: number;
    totalVolume: string;
    agents: AgentPreview[];   // Top 3-5 agents, compact format
  };
}
```

### Page: Team Detail (`/teams/[teamId]`)

**Layout:**
- Team header: logo, name, tier badge, tagline, website link, stats bar
- Full agent roster: all agents on this team, displayed as full AgentCards
- "Powered by OrderlyAgents" footer with CTA to browse marketplace
- If the connected wallet owns this team: show "Manage Team" button → team builder UI with drag-and-drop reordering and "Add from Marketplace" flow

### Page: Marketplace (`/marketplace`)

**Layout:**
- Search bar with division filter tabs (All, Trading, Building, Analytics, Social, Starchild AI, Infrastructure)
- Stats bar: total agents, total installs, active teams, contributors
- Agent grid: responsive card layout
- Each AgentCard shows: icon, name, author, description, tags, runtime badge, risk dot, star count, install count, "Add to Team" button
- Sort options: Trending, Most Stars, Most Installs, Newest

### Page: Agent Detail (`/marketplace/[agentId]`)

**Layout:**
- Header: agent name, publisher badge, runtime badge, risk level, star/install counts
- Tab navigation: Overview | Configuration | Reviews | Changelog
- Overview tab: long description (rendered Markdown), supported chains, broker compatibility, source repo link
- Configuration tab: rendered JSON schema form (if agent has configSchema)
- Install/Connect/Download CTA based on runtime tier
- Sidebar: publisher card, related agents (same division), teams using this agent

### Page: Submit Agent (`/publish`)

**Requires wallet connection.**

**Flow:**
1. Choose runtime tier (Skill / MCP / Hosted)
2. Fill agent spec form (validated with AgentSpecSchema)
3. Upload skill file (Tier 1) or provide MCP server URL (Tier 2)
4. Preview listing
5. Submit for review → status becomes "pending_review"

### Page: Publisher Profile (`/publisher/[publisherId]`)

**Layout:**
- Publisher header: name, avatar, verified badge, website, Twitter, GitHub
- Grid of all agents by this publisher
- Stats: total agents, total installs across all agents, total stars

---

## 7. Design System

### Brand

OrderlyAgents inherits the Orderly purple/violet palette but with a darker, more terminal-like aesthetic to signal "infrastructure" and "developer tool."

```css
:root {
  /* Backgrounds */
  --bg-primary: #0A0815;
  --bg-secondary: #0F0C1E;
  --bg-card: rgba(255, 255, 255, 0.02);
  --bg-card-hover: rgba(139, 92, 246, 0.06);

  /* Purple scale */
  --purple-50: #FAF5FF;
  --purple-100: #F3E8FF;
  --purple-200: #E9D5FF;
  --purple-300: #D8B4FE;
  --purple-400: #C084FC;
  --purple-500: #A855F7;
  --purple-600: #9333EA;
  --purple-700: #7C3AED;
  --purple-800: #6D28D9;
  --purple-900: #4C1D95;
  --purple-950: #1E1B4B;

  /* Text */
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
  --text-accent: #C084FC;

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-hover: rgba(139, 92, 246, 0.25);
  --border-active: rgba(139, 92, 246, 0.4);

  /* Tier colors */
  --tier-diamond: #60A5FA;
  --tier-platinum: #E2E8F0;
  --tier-gold: #FACC15;
  --tier-silver: #94A3B8;
  --tier-bronze: #D97706;

  /* Risk colors */
  --risk-low: #22C55E;
  --risk-medium: #F59E0B;
  --risk-high: #EF4444;
  --risk-degen: #DC2626;

  /* Runtime badge colors */
  --runtime-skill-border: #4338CA;
  --runtime-mcp-border: #7C3AED;
  --runtime-hosted-border: #A855F7;
}
```

### Typography

- **Headings**: Inter 700-900, tight letter-spacing (-0.02em to -0.03em)
- **Body**: Inter 400-500, 13-14px, line-height 1.5-1.6
- **Mono/Technical**: JetBrains Mono 500-700 — used for agent names, version numbers, wallet addresses, runtime badges
- **Accent gradient text**: `background: linear-gradient(135deg, #A855F7, #C084FC, #E879F9)` with `-webkit-background-clip: text`

### Component Patterns

- **Cards**: subtle background gradient, 1px border that brightens on hover, 2px top-edge glow in division color, `translateY(-2px)` on hover
- **Badges**: pill-shaped, dark background with colored border and text matching the border color
- **Buttons**: primary uses purple gradient with glow shadow, secondary uses ghost style with border
- **Grid layouts**: `repeat(auto-fill, minmax(300-340px, 1fr))` for responsive without breakpoint soup
- **Empty states**: centered icon + message + CTA, dashed border container

---

## 8. Auth (SIWE)

Wallet-first authentication using Sign-In With Ethereum. No email, no password, no OAuth.

```typescript
// lib/auth/siwe.ts — implementation outline

// 1. Frontend: user clicks "Connect Wallet" → wagmi modal
// 2. Frontend: calls auth.getNonce() → gets random nonce from server
// 3. Frontend: constructs SIWE message with nonce, domain, chain
// 4. Frontend: wallet signs message → signature
// 5. Frontend: calls auth.verify({ message, signature })
// 6. Backend: verifies signature matches wallet address
// 7. Backend: creates session (JWT or cookie-based)
// 8. All subsequent protectedProcedure calls check session

// Session contains: { walletAddress, publisherId?, teamIds? }
```

**What requires auth:**
- Submitting agents
- Starring agents
- Installing agents (recorded)
- Managing teams (add/remove agents, reorder)
- Managing publisher profile

**What is public:**
- Browsing marketplace
- Viewing teams
- Viewing agent details
- Searching

---

## 9. Seed Data

V1 ships with 12-15 seed agents across all divisions. These are real, functional agents — not placeholder content.

### Required Seed Agents

| Agent | Division | Runtime | Priority |
|-------|----------|---------|----------|
| Graduation Sniper | trading | hosted (listed, not runnable in V1) | P0 |
| CLOB Market Maker | trading | hosted (listed, not runnable in V1) | P0 |
| Copy Trade Engine | trading | hosted (listed, not runnable in V1) | P1 |
| Liquidation Hunter | trading | hosted (listed, not runnable in V1) | P1 |
| Orderbook Analyst | analytics | mcp | P0 |
| Starchild DEX Vibe Coder | starchild | mcp | P0 |
| Starchild Theme Agent | starchild | mcp | P0 |
| Starchild Analytics Module | starchild | mcp | P1 |
| Contract Deployer | building | mcp | P1 |
| Social Leaderboard Engine | social | skill | P0 |
| Quest Designer | social | skill | P1 |
| Bridge Monitor | infra | hosted (listed, not runnable in V1) | P2 |
| Whale Watcher | analytics | skill | P2 |

### Required Seed Teams

| Team | Tier | Agents |
|------|------|--------|
| WOOFi | Diamond | CLOB Market Maker, Orderbook Analyst, Copy Trade Engine, Starchild DEX Vibe Coder, Starchild Theme Agent |
| LogX | Diamond | Graduation Sniper, CLOB Market Maker, Orderbook Analyst, Contract Deployer, Starchild Analytics Module |
| Elixir DEX | Gold | Social Leaderboard Engine, Orderbook Analyst, Quest Designer, Starchild Theme Agent |

### Required Seed Publishers

| Publisher | Verified | Ecosystem Partner | Agents |
|-----------|----------|-------------------|--------|
| orderly-core | ✅ | ✅ | CLOB Market Maker, Contract Deployer |
| starchild-ai | ✅ | ✅ | DEX Vibe Coder, Theme Agent, Analytics Module |
| 52kskew | ✅ | ❌ | Leaderboard Engine, Quest Designer |
| 0xVelocity | ❌ | ❌ | Graduation Sniper |
| mirrorfi | ❌ | ❌ | Copy Trade Engine |
| degenalpha | ❌ | ❌ | Liquidation Hunter |
| flowtrader | ❌ | ❌ | Orderbook Analyst, Whale Watcher |
| infrawatch | ❌ | ❌ | Bridge Monitor |

---

## 10. V1 Scope & Milestones

### What V1 Ships

- Agent Teams page (landing) with seed teams
- Individual team detail pages
- Marketplace browser with division filters, search, sort
- Agent detail pages with full descriptions
- Publisher profiles
- SIWE wallet auth
- Star and install tracking
- Agent submission form (pending_review status — no auto-approval)
- Tier 1 (skill download) and Tier 2 (MCP connect URL) functional
- Tier 3 listed but marked "Coming Soon" with waitlist
- Mobile responsive
- SEO: SSR agent detail pages, OG images, structured data

### What V1 Does NOT Ship

- Tier 3 hosted execution runtime
- Agent reviews/ratings (data model exists, UI deferred)
- $ORDER token integration
- On-chain agent registration
- Agent versioning/update flow
- Agent analytics dashboard for publishers
- Team builder drag-and-drop (V1 uses simple add/remove)

### Milestone Sequence

```
Week 1: Foundation
  ├── Next.js 16 project scaffold with Turbo monorepo
  ├── Drizzle schema + initial migration
  ├── tRPC router skeleton
  ├── SIWE auth flow
  ├── Basic layout (header, nav, footer)
  └── Design tokens + Tailwind config

Week 2: Core Pages
  ├── Agent Teams page with TeamCard components
  ├── Marketplace page with AgentCard grid
  ├── Division filter + search
  ├── Agent detail page
  └── Seed data loaded

Week 3: Interactivity + Publishing
  ├── Star + install tracking
  ├── Team detail page with roster
  ├── Publisher profile page
  ├── Agent submission form
  ├── Skill file upload to R2
  └── MCP URL validation

Week 4: Polish + Deploy
  ├── Mobile responsive pass
  ├── SSR + SEO (OG images, meta tags)
  ├── Loading states, error boundaries
  ├── Seed agents: write actual SKILL.md content
  ├── Deploy to Vercel
  └── Subdomain: agents.orderly.network
```

---

## 11. Environment Variables

```bash
# .env.example

# Database
DATABASE_URL=postgresql://user:pass@host:5432/orderly_agents

# Auth
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
SESSION_SECRET=random_32_char_secret

# Storage (Cloudflare R2 or S3-compatible)
S3_ENDPOINT=https://your-account.r2.cloudflarestorage.com
S3_BUCKET=orderly-agents
S3_ACCESS_KEY=your_access_key
S3_SECRET_KEY=your_secret_key

# Orderly SDK
ORDERLY_API_BASE=https://api-evm.orderly.org
ORDERLY_WS_BASE=wss://ws-evm.orderly.org

# App
NEXT_PUBLIC_APP_URL=https://agents.orderly.network
NEXT_PUBLIC_CHAIN_ID=42161

# Monitoring
SENTRY_DSN=your_sentry_dsn
```

---

## 12. Security Considerations

1. **Agent execution sandboxing** — Tier 3 agents (when built) must run in isolated containers with no access to host filesystem, other agents, or other users' data. Network egress limited to Orderly API endpoints only.

2. **Skill file validation** — uploaded .zip files must be scanned: no executables, no symlinks, max file size 10MB, must contain SKILL.md at root. Parse YAML frontmatter with safe YAML parser (no code execution).

3. **MCP URL validation** — only HTTPS URLs accepted. Platform makes a health check request on submission. URLs are displayed to users but never fetched server-side in a way that could enable SSRF.

4. **Wallet auth** — SIWE nonces are single-use and expire after 5 minutes. Session tokens are httpOnly, secure, sameSite strict.

5. **Rate limiting** — all mutation endpoints rate-limited per wallet: 10 submissions/hour, 100 stars/hour, 50 installs/hour.

6. **No private key handling** — OrderlyAgents never touches user private keys. All signing happens in the user's wallet. Tier 3 agents (V2) will use API key delegation, not private keys.

7. **Input sanitization** — all user-provided Markdown is rendered with a sanitizer that strips scripts, iframes, and event handlers. Agent descriptions and long descriptions are sanitized before storage.

---

## 13. Future Considerations (Post-V1)

These are documented for architectural awareness. Do not implement them now, but do not make decisions that block them.

- **$ORDER token gating**: Agents can require $ORDER staking to access. Teams can require minimum $ORDER to add agents. Publisher verification via $ORDER stake.
- **On-chain agent registry**: Agent specs registered on Orderly Chain as an OrderlyCore module. Enables trustless agent discovery and composition.
- **Revenue sharing**: Hosted agents can charge per-trade fees (basis points on volume). Split between agent creator and OrderlyAgents platform.
- **Orderly Social integration**: Agent usage generates Orderly Social Points (OSP). Top agents featured on Orderly Social leaderboards. Agent creator badges in the progression system.
- **Composable agent pipelines**: Agents can call other agents. A "Portfolio Manager" agent could orchestrate a Market Maker + Risk Monitor + PnL Tracker.
- **Farcaster/Lens integration**: Agent activity published as social protocol posts. Social agents can read and write to decentralised social graphs.

---

*This document is the canonical reference. When in doubt, follow what's written here. When this document is silent on a topic, make the decision a senior crypto engineer would make and document it in a PR comment.*
