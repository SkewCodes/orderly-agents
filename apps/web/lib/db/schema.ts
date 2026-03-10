import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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
  "skill",
  "mcp",
  "hosted",
  "hybrid",
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

export const publishers = pgTable(
  "publishers",
  {
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
    isVerified: boolean("is_verified").default(false),
    isEcosystemPartner: boolean("is_ecosystem_partner").default(false),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("publishers_slug_idx").on(table.slug),
    index("publishers_wallet_idx").on(table.walletAddress),
  ]
);

// ─── Agents ───────────────────────────────────────────────

export const agents = pgTable(
  "agents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    publisherId: uuid("publisher_id")
      .references(() => publishers.id)
      .notNull(),
    version: varchar("version", { length: 20 }).notNull().default("1.0.0"),
    division: divisionEnum("division").notNull(),
    runtime: runtimeEnum("runtime").notNull(),
    riskLevel: riskEnum("risk_level").notNull().default("low"),
    status: agentStatusEnum("status").notNull().default("draft"),

    description: text("description").notNull(),
    longDescription: text("long_description"),
    iconEmoji: varchar("icon_emoji", { length: 10 }),
    thumbnailUrl: text("thumbnail_url"),

    supportedChains: jsonb("supported_chains")
      .$type<string[]>()
      .default([]),
    brokerCompatibility: varchar("broker_compatibility", {
      length: 20,
    }).default("all"),
    orderlySDKVersion: varchar("orderly_sdk_version", { length: 20 }),
    mcpServerUrl: text("mcp_server_url"),
    skillFileUrl: text("skill_file_url"),
    hostedEndpoint: text("hosted_endpoint"),
    sourceRepoUrl: text("source_repo_url"),

    tags: jsonb("tags").$type<string[]>().default([]),
    searchVector: text("search_vector"),

    starCount: integer("star_count").default(0),
    installCount: integer("install_count").default(0),
    activeInstances: integer("active_instances").default(0),

    configSchema: jsonb("config_schema").$type<Record<string, unknown>>(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    publishedAt: timestamp("published_at"),
  },
  (table) => [
    uniqueIndex("agents_slug_idx").on(table.slug),
    index("agents_division_idx").on(table.division),
    index("agents_runtime_idx").on(table.runtime),
    index("agents_publisher_idx").on(table.publisherId),
    index("agents_status_idx").on(table.status),
  ]
);

// ─── Teams (DEX Agent Teams) ──────────────────────────────

export const teams = pgTable(
  "teams",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    ownerWallet: varchar("owner_wallet", { length: 42 }).notNull(),
    tier: tierEnum("tier").notNull().default("bronze"),

    displayName: varchar("display_name", { length: 100 }).notNull(),
    tagline: text("tagline"),
    logoUrl: text("logo_url"),
    logoColor: varchar("logo_color", { length: 7 }),
    websiteUrl: text("website_url"),
    brokerIdOnOrderly: varchar("broker_id", { length: 50 }),

    memberCount: integer("member_count").default(0),
    totalVolume: varchar("total_volume", { length: 50 }),
    agentCount: integer("agent_count").default(0),

    isVerified: boolean("is_verified").default(false),
    isPublic: boolean("is_public").default(true),

    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("teams_slug_idx").on(table.slug),
    index("teams_owner_idx").on(table.ownerWallet),
  ]
);

// ─── Team ↔ Agent Junction ───────────────────────────────

export const teamAgents = pgTable(
  "team_agents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    teamId: uuid("team_id")
      .references(() => teams.id, { onDelete: "cascade" })
      .notNull(),
    agentId: uuid("agent_id")
      .references(() => agents.id, { onDelete: "cascade" })
      .notNull(),
    addedBy: varchar("added_by", { length: 42 }).notNull(),
    isFeatured: boolean("is_featured").default(false),
    displayOrder: integer("display_order").default(0),
    agentConfig: jsonb("agent_config").$type<Record<string, unknown>>(),
    addedAt: timestamp("added_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("team_agents_unique_idx").on(table.teamId, table.agentId),
    index("team_agents_team_idx").on(table.teamId),
  ]
);

// ─── Installs (user ↔ agent) ─────────────────────────────

export const installs = pgTable(
  "installs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    agentId: uuid("agent_id")
      .references(() => agents.id, { onDelete: "cascade" })
      .notNull(),
    walletAddress: varchar("wallet_address", { length: 42 }).notNull(),
    runtime: runtimeEnum("runtime").notNull(),
    config: jsonb("config").$type<Record<string, unknown>>(),
    isActive: boolean("is_active").default(true),
    installedAt: timestamp("installed_at").defaultNow().notNull(),
    lastUsedAt: timestamp("last_used_at"),
  },
  (table) => [
    uniqueIndex("installs_unique_idx").on(table.agentId, table.walletAddress),
    index("installs_wallet_idx").on(table.walletAddress),
    index("installs_agent_idx").on(table.agentId),
  ]
);

// ─── Stars (user ↔ agent) ────────────────────────────────

export const stars = pgTable(
  "stars",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    agentId: uuid("agent_id")
      .references(() => agents.id, { onDelete: "cascade" })
      .notNull(),
    walletAddress: varchar("wallet_address", { length: 42 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("stars_unique_idx").on(table.agentId, table.walletAddress),
  ]
);

// ─── Reviews ──────────────────────────────────────────────

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    agentId: uuid("agent_id")
      .references(() => agents.id, { onDelete: "cascade" })
      .notNull(),
    walletAddress: varchar("wallet_address", { length: 42 }).notNull(),
    rating: integer("rating").notNull(),
    content: text("content"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("reviews_unique_idx").on(table.agentId, table.walletAddress),
  ]
);

// ─── Relations ────────────────────────────────────────────

export const publishersRelations = relations(publishers, ({ many }) => ({
  agents: many(agents),
}));

export const agentsRelations = relations(agents, ({ one, many }) => ({
  publisher: one(publishers, {
    fields: [agents.publisherId],
    references: [publishers.id],
  }),
  teamAgents: many(teamAgents),
  installs: many(installs),
  stars: many(stars),
  reviews: many(reviews),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  teamAgents: many(teamAgents),
}));

export const teamAgentsRelations = relations(teamAgents, ({ one }) => ({
  team: one(teams, {
    fields: [teamAgents.teamId],
    references: [teams.id],
  }),
  agent: one(agents, {
    fields: [teamAgents.agentId],
    references: [agents.id],
  }),
}));

export const installsRelations = relations(installs, ({ one }) => ({
  agent: one(agents, {
    fields: [installs.agentId],
    references: [agents.id],
  }),
}));

export const starsRelations = relations(stars, ({ one }) => ({
  agent: one(agents, {
    fields: [stars.agentId],
    references: [agents.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  agent: one(agents, {
    fields: [reviews.agentId],
    references: [agents.id],
  }),
}));
