import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { publishers, agents, teams, teamAgents } from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

async function seed() {
  console.log("Seeding database...");

  // ─── Publishers ─────────────────────────────────────────

  const [orderlyCore] = await db
    .insert(publishers)
    .values({
      name: "orderly-core",
      slug: "orderly-core",
      walletAddress: "0x1111111111111111111111111111111111111111",
      displayName: "Orderly Core",
      description:
        "Protocol-level infrastructure agents maintained by the Orderly Network core team. Battle-tested against the shared CLOB.",
      isVerified: true,
      isEcosystemPartner: true,
      twitterHandle: "OrderlyNetwork",
      githubOrg: "OrderlyNetwork",
      websiteUrl: "https://orderly.network",
    })
    .returning();

  const [starchildAi] = await db
    .insert(publishers)
    .values({
      name: "starchild-ai",
      slug: "starchild-ai",
      walletAddress: "0x2222222222222222222222222222222222222222",
      displayName: "Starchild AI",
      description:
        "Vibe-coding agents that let you build, theme, and analyze DEX frontends using natural language.",
      isVerified: true,
      isEcosystemPartner: true,
      twitterHandle: "StarchildAI",
      websiteUrl: "https://starchild.ai",
    })
    .returning();

  const [publisher52k] = await db
    .insert(publishers)
    .values({
      name: "52kskew",
      slug: "52kskew",
      walletAddress: "0x3333333333333333333333333333333333333333",
      displayName: "52kskew",
      description:
        "Community builder focused on social and gamification layers for DeFi protocols.",
      isVerified: true,
      isEcosystemPartner: false,
    })
    .returning();

  const [velocity] = await db
    .insert(publishers)
    .values({
      name: "0xVelocity",
      slug: "0xvelocity",
      walletAddress: "0x4444444444444444444444444444444444444444",
      displayName: "0xVelocity",
      description:
        "High-frequency trading agents specializing in Velocity graduation events.",
      isVerified: false,
      isEcosystemPartner: false,
    })
    .returning();

  const [mirrorfi] = await db
    .insert(publishers)
    .values({
      name: "mirrorfi",
      slug: "mirrorfi",
      walletAddress: "0x5555555555555555555555555555555555555555",
      displayName: "MirrorFi",
      description:
        "Mirror the best traders on Orderly with automated copy-trading agents.",
      isVerified: false,
      isEcosystemPartner: false,
    })
    .returning();

  const [degenalpha] = await db
    .insert(publishers)
    .values({
      name: "degenalpha",
      slug: "degenalpha",
      walletAddress: "0x6666666666666666666666666666666666666666",
      displayName: "DegenAlpha",
      description:
        "High-risk, high-reward agents for advanced DeFi strategies. Not for the faint of heart.",
      isVerified: false,
      isEcosystemPartner: false,
    })
    .returning();

  const [flowtrader] = await db
    .insert(publishers)
    .values({
      name: "flowtrader",
      slug: "flowtrader",
      walletAddress: "0x7777777777777777777777777777777777777777",
      displayName: "FlowTrader",
      description:
        "Data-driven analytics and monitoring agents for Orderly orderbook intelligence.",
      isVerified: false,
      isEcosystemPartner: false,
    })
    .returning();

  const [infrawatch] = await db
    .insert(publishers)
    .values({
      name: "infrawatch",
      slug: "infrawatch",
      walletAddress: "0x8888888888888888888888888888888888888888",
      displayName: "InfraWatch",
      description: "Infrastructure monitoring agents for cross-chain bridge operations.",
      isVerified: false,
      isEcosystemPartner: false,
    })
    .returning();

  console.log("Publishers seeded");

  // ─── Agents ─────────────────────────────────────────────

  const [graduationSniper] = await db
    .insert(agents)
    .values({
      name: "Graduation Sniper",
      slug: "graduation-sniper",
      publisherId: velocity!.id,
      division: "trading",
      runtime: "hosted",
      riskLevel: "degen",
      status: "approved",
      iconEmoji: "🎯",
      description:
        "Automatically snipes token graduations on Velocity. Detects graduation events via WebSocket and places immediate buy orders on the Orderly CLOB the moment a token migrates.",
      longDescription:
        "## How It Works\n\nThe Graduation Sniper monitors Velocity's graduation event stream in real-time. When a token graduates from the bonding curve to the Orderly CLOB:\n\n1. **Detection** — WebSocket listener catches the graduation event within milliseconds\n2. **Analysis** — Evaluates initial liquidity depth, buy/sell pressure, and graduation momentum\n3. **Execution** — Places a market or aggressive limit order on the CLOB before the crowd\n4. **Risk Management** — Automatically sets stop-loss and take-profit based on configurable parameters\n\n## Risk Warning\n\nThis is a **degen-tier** agent. Graduation snipes are inherently high-risk. Tokens can dump immediately after graduation. Only use with capital you can afford to lose.\n\n## Configuration\n\n- `maxPositionSize` — Maximum USD size per snipe\n- `stopLossPercent` — Auto stop-loss percentage (default: 15%)\n- `takeProfitPercent` — Auto take-profit percentage (default: 50%)\n- `minLiquidity` — Minimum initial CLOB liquidity to trigger (filters thin books)",
      supportedChains: ["arbitrum", "base"],
      tags: ["graduation", "sniper", "velocity", "high-frequency", "automated"],
      starCount: 342,
      installCount: 189,
      publishedAt: new Date(),
      configSchema: {
        maxPositionSize: { type: "number", default: 100, min: 10, max: 10000 },
        stopLossPercent: { type: "number", default: 15, min: 5, max: 50 },
        takeProfitPercent: { type: "number", default: 50, min: 10, max: 500 },
        minLiquidity: { type: "number", default: 5000, min: 1000 },
      },
    })
    .returning();

  const [clobMM] = await db
    .insert(agents)
    .values({
      name: "CLOB Market Maker",
      slug: "clob-market-maker",
      publisherId: orderlyCore!.id,
      division: "trading",
      runtime: "hosted",
      riskLevel: "high",
      status: "approved",
      iconEmoji: "📊",
      description:
        "Professional-grade market making on the Orderly CLOB. Maintains tight spreads, manages inventory risk, and adapts quoting to real-time volatility and orderbook imbalance.",
      longDescription:
        "## Overview\n\nThe CLOB Market Maker is a production-ready market making agent designed for the Orderly shared orderbook. It implements the Avellaneda-Stoikov framework adapted for crypto perpetuals.\n\n## Features\n\n- **Dynamic Spread** — Adjusts bid-ask spread based on volatility, inventory skew, and order flow toxicity\n- **Inventory Management** — Keeps net position within configurable bounds using skewed quoting\n- **Multi-Level Quoting** — Places orders at multiple price levels to capture varying fill probabilities\n- **Gas Optimization** — Batches order updates to minimize settlement gas costs\n\n## Requirements\n\n- Orderly account with API key delegation\n- Minimum balance: $1,000 USDC\n- Supported on all Orderly-connected chains",
      supportedChains: ["arbitrum", "optimism", "base", "mantle"],
      tags: ["market-making", "clob", "liquidity", "professional", "spreads"],
      starCount: 521,
      installCount: 87,
      publishedAt: new Date(),
      configSchema: {
        spreadBps: { type: "number", default: 10, min: 2, max: 100 },
        maxInventory: { type: "number", default: 5000 },
        quoteLevels: { type: "number", default: 5, min: 1, max: 20 },
      },
    })
    .returning();

  const [copyTrade] = await db
    .insert(agents)
    .values({
      name: "Copy Trade Engine",
      slug: "copy-trade-engine",
      publisherId: mirrorfi!.id,
      division: "trading",
      runtime: "hosted",
      riskLevel: "medium",
      status: "approved",
      iconEmoji: "🪞",
      description:
        "Mirror the positions of top traders on Orderly in real-time. Select a leader wallet, configure risk parameters, and the agent automatically replicates their trades proportionally.",
      supportedChains: ["arbitrum", "optimism", "base"],
      tags: ["copy-trading", "mirror", "social-trading", "automated"],
      starCount: 278,
      installCount: 156,
      publishedAt: new Date(),
    })
    .returning();

  const [liqHunter] = await db
    .insert(agents)
    .values({
      name: "Liquidation Hunter",
      slug: "liquidation-hunter",
      publisherId: degenalpha!.id,
      division: "trading",
      runtime: "hosted",
      riskLevel: "degen",
      status: "approved",
      iconEmoji: "🏹",
      description:
        "Monitors leveraged positions nearing liquidation thresholds. Positions counter-trades to profit from cascading liquidations on the Orderly CLOB.",
      supportedChains: ["arbitrum"],
      tags: ["liquidation", "perps", "leverage", "degen"],
      starCount: 195,
      installCount: 67,
      publishedAt: new Date(),
      configSchema: {
        minLiqSize: { type: "number", default: 10000 },
        maxExposure: { type: "number", default: 5000 },
      },
    })
    .returning();

  const [orderbookAnalyst] = await db
    .insert(agents)
    .values({
      name: "Orderbook Analyst",
      slug: "orderbook-analyst",
      publisherId: flowtrader!.id,
      division: "analytics",
      runtime: "mcp",
      riskLevel: "low",
      status: "approved",
      iconEmoji: "📈",
      description:
        "Deep orderbook analysis via MCP. Fetches L2 orderbook data, calculates bid-ask imbalance, identifies support/resistance zones, and provides trade signals based on microstructure patterns.",
      longDescription:
        "## Tools Provided\n\nThis MCP agent exposes the following tools to Claude:\n\n- `analyzeOrderbook(symbol)` — Full L2 orderbook analysis with imbalance score\n- `findLiquidityZones(symbol)` — Identifies clusters of resting orders as S/R levels\n- `getSpreadHistory(symbol, period)` — Tracks spread dynamics over time\n- `detectSpoofing(symbol)` — Flags potential spoofing patterns in the book\n\n## Usage\n\nConnect via MCP URL in Claude settings. Then ask Claude questions like:\n\n> \"Analyze the PERP_BTC_USDC orderbook and tell me if there's unusual bid-side pressure.\"\n\n> \"Where are the major liquidity zones for PERP_ETH_USDC right now?\"",
      mcpServerUrl: "https://mcp.orderly-agents.network/orderbook-analyst",
      supportedChains: ["all"],
      tags: ["orderbook", "analytics", "microstructure", "mcp", "signals"],
      starCount: 445,
      installCount: 312,
      publishedAt: new Date(),
    })
    .returning();

  const [dexVibeCoder] = await db
    .insert(agents)
    .values({
      name: "DEX Vibe Coder",
      slug: "dex-vibe-coder",
      publisherId: starchildAi!.id,
      division: "starchild",
      runtime: "mcp",
      riskLevel: "low",
      status: "approved",
      iconEmoji: "✨",
      description:
        "Vibe-code your DEX frontend using natural language. Generates React components, trading views, and portfolio dashboards that integrate with the Orderly SDK out of the box.",
      longDescription:
        "## What Is Vibe Coding?\n\nVibe coding is building software by describing what you want in natural language. The DEX Vibe Coder understands Orderly SDK patterns and DEX Builder conventions, so you can say:\n\n> \"Build me a trading view with an orderbook, trade history panel, and a chart. Use the Orderly SDK for real-time data.\"\n\nAnd it generates production-ready React components.\n\n## MCP Tools\n\n- `generateComponent(description)` — Creates a full React component\n- `scaffoldPage(layout)` — Generates a complete page layout\n- `integrateSDK(feature)` — Adds Orderly SDK integration to existing code\n- `applyTheme(theme)` — Applies a design theme to generated components",
      mcpServerUrl: "https://mcp.starchild.ai/dex-vibe-coder",
      supportedChains: ["all"],
      tags: ["vibe-coding", "starchild", "frontend", "react", "dex-builder"],
      starCount: 389,
      installCount: 267,
      publishedAt: new Date(),
    })
    .returning();

  const [themeAgent] = await db
    .insert(agents)
    .values({
      name: "Theme Agent",
      slug: "starchild-theme-agent",
      publisherId: starchildAi!.id,
      division: "starchild",
      runtime: "mcp",
      riskLevel: "low",
      status: "approved",
      iconEmoji: "🎨",
      description:
        "Generate and apply custom themes to any Orderly DEX Builder deployment. Describe your brand vibe and get a complete design token set, component overrides, and CSS variables.",
      mcpServerUrl: "https://mcp.starchild.ai/theme-agent",
      supportedChains: ["all"],
      tags: ["theming", "design", "starchild", "css", "branding"],
      starCount: 234,
      installCount: 198,
      publishedAt: new Date(),
    })
    .returning();

  const [analyticsModule] = await db
    .insert(agents)
    .values({
      name: "Analytics Module",
      slug: "starchild-analytics-module",
      publisherId: starchildAi!.id,
      division: "starchild",
      runtime: "mcp",
      riskLevel: "low",
      status: "approved",
      iconEmoji: "📉",
      description:
        "Drop-in analytics dashboards for DEX Builder deployments. Generates trading volume charts, user retention funnels, and PnL leaderboards with Orderly data integration.",
      mcpServerUrl: "https://mcp.starchild.ai/analytics-module",
      supportedChains: ["all"],
      tags: ["analytics", "dashboard", "starchild", "charts", "metrics"],
      starCount: 156,
      installCount: 89,
      publishedAt: new Date(),
    })
    .returning();

  const [contractDeployer] = await db
    .insert(agents)
    .values({
      name: "Contract Deployer",
      slug: "contract-deployer",
      publisherId: orderlyCore!.id,
      division: "building",
      runtime: "mcp",
      riskLevel: "low",
      status: "approved",
      iconEmoji: "🔧",
      description:
        "Guided smart contract deployment for Orderly-integrated protocols. Walks you through broker registration, vault setup, and cross-chain contract deployment with safety checks.",
      mcpServerUrl: "https://mcp.orderly-agents.network/contract-deployer",
      supportedChains: ["arbitrum", "optimism", "base", "mantle", "polygon"],
      tags: ["contracts", "deployment", "solidity", "builder", "setup"],
      starCount: 167,
      installCount: 94,
      publishedAt: new Date(),
    })
    .returning();

  const [leaderboard] = await db
    .insert(agents)
    .values({
      name: "Social Leaderboard Engine",
      slug: "social-leaderboard-engine",
      publisherId: publisher52k!.id,
      division: "social",
      runtime: "skill",
      riskLevel: "low",
      status: "approved",
      iconEmoji: "🏆",
      description:
        "A Claude Skill that helps you design and implement trading leaderboards for your DEX. Generates ranking algorithms, reward distribution logic, and frontend components for Orderly Social integration.",
      longDescription:
        "## What This Skill Does\n\nThe Leaderboard Engine is a Claude Skill (Tier 1) that provides deep expertise in designing competitive trading leaderboards:\n\n- **Ranking Algorithms** — PnL-based, volume-based, Sharpe-based, or custom composite scoring\n- **Anti-Gaming** — Wash trading detection, minimum trade thresholds, time-weighted scoring\n- **Reward Logic** — Prize pool distribution, tier-based rewards, streak bonuses\n- **Frontend Components** — Ready-made React components for leaderboard tables, user cards, and achievement badges\n\n## How to Use\n\n1. Download the .zip file\n2. Upload to Claude.ai Settings > Skills\n3. Ask Claude to help you build a leaderboard",
      skillFileUrl: "https://storage.orderly-agents.network/skills/social-leaderboard-engine.zip",
      supportedChains: ["all"],
      tags: ["leaderboard", "social", "gamification", "skill", "ranking"],
      starCount: 289,
      installCount: 423,
      publishedAt: new Date(),
    })
    .returning();

  const [questDesigner] = await db
    .insert(agents)
    .values({
      name: "Quest Designer",
      slug: "quest-designer",
      publisherId: publisher52k!.id,
      division: "social",
      runtime: "skill",
      riskLevel: "low",
      status: "approved",
      iconEmoji: "🎮",
      description:
        "Design and implement trading quests and achievement systems for your DEX. Create onboarding flows, trading challenges, and reward campaigns that drive user engagement.",
      skillFileUrl: "https://storage.orderly-agents.network/skills/quest-designer.zip",
      supportedChains: ["all"],
      tags: ["quests", "achievements", "engagement", "social", "gamification"],
      starCount: 178,
      installCount: 245,
      publishedAt: new Date(),
    })
    .returning();

  const [bridgeMonitor] = await db
    .insert(agents)
    .values({
      name: "Bridge Monitor",
      slug: "bridge-monitor",
      publisherId: infrawatch!.id,
      division: "infra",
      runtime: "hosted",
      riskLevel: "low",
      status: "approved",
      iconEmoji: "🌉",
      description:
        "Monitors cross-chain bridge operations for Orderly-connected chains. Alerts on stuck transactions, unusual volume spikes, and bridge health degradation.",
      supportedChains: ["arbitrum", "optimism", "base", "mantle", "polygon"],
      tags: ["bridge", "monitoring", "infrastructure", "alerts", "cross-chain"],
      starCount: 98,
      installCount: 34,
      publishedAt: new Date(),
    })
    .returning();

  const [whaleWatcher] = await db
    .insert(agents)
    .values({
      name: "Whale Watcher",
      slug: "whale-watcher",
      publisherId: flowtrader!.id,
      division: "analytics",
      runtime: "skill",
      riskLevel: "low",
      status: "approved",
      iconEmoji: "🐋",
      description:
        "A Claude Skill for tracking large wallet movements and whale activity on Orderly-connected chains. Identifies accumulation patterns, large transfers, and smart money flows.",
      skillFileUrl: "https://storage.orderly-agents.network/skills/whale-watcher.zip",
      supportedChains: ["arbitrum", "optimism", "base"],
      tags: ["whale-tracking", "analytics", "smart-money", "on-chain"],
      starCount: 134,
      installCount: 87,
      publishedAt: new Date(),
    })
    .returning();

  console.log("Agents seeded");

  // ─── Teams ──────────────────────────────────────────────

  const [woofi] = await db
    .insert(teams)
    .values({
      name: "woofi",
      slug: "woofi",
      ownerWallet: "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      tier: "diamond",
      displayName: "WOOFi",
      tagline: "The most liquid perp DEX with AI-powered trading",
      logoColor: "#00C2B7",
      websiteUrl: "https://fi.woo.org",
      brokerIdOnOrderly: "woofi",
      memberCount: 12400,
      totalVolume: "2450000000",
      agentCount: 5,
      isVerified: true,
    })
    .returning();

  const [logx] = await db
    .insert(teams)
    .values({
      name: "logx",
      slug: "logx",
      ownerWallet: "0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
      tier: "diamond",
      displayName: "LogX",
      tagline: "Omnichain perpetuals powered by Orderly + AI agents",
      logoColor: "#FF6B35",
      websiteUrl: "https://logx.trade",
      brokerIdOnOrderly: "logx",
      memberCount: 8700,
      totalVolume: "1820000000",
      agentCount: 5,
      isVerified: true,
    })
    .returning();

  const [elixirDex] = await db
    .insert(teams)
    .values({
      name: "elixir-dex",
      slug: "elixir-dex",
      ownerWallet: "0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
      tier: "gold",
      displayName: "Elixir DEX",
      tagline: "Community-driven DEX with social-first trading features",
      logoColor: "#8B5CF6",
      websiteUrl: "https://elixir.exchange",
      brokerIdOnOrderly: "elixir",
      memberCount: 3200,
      totalVolume: "560000000",
      agentCount: 4,
      isVerified: true,
    })
    .returning();

  console.log("Teams seeded");

  // ─── Team ↔ Agent Assignments ──────────────────────────

  const ownerA = "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const ownerB = "0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB";
  const ownerC = "0xCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC";

  // WOOFi team
  await db.insert(teamAgents).values([
    { teamId: woofi!.id, agentId: clobMM!.id, addedBy: ownerA, isFeatured: true, displayOrder: 0 },
    { teamId: woofi!.id, agentId: orderbookAnalyst!.id, addedBy: ownerA, displayOrder: 1 },
    { teamId: woofi!.id, agentId: copyTrade!.id, addedBy: ownerA, displayOrder: 2 },
    { teamId: woofi!.id, agentId: dexVibeCoder!.id, addedBy: ownerA, displayOrder: 3 },
    { teamId: woofi!.id, agentId: themeAgent!.id, addedBy: ownerA, displayOrder: 4 },
  ]);

  // LogX team
  await db.insert(teamAgents).values([
    { teamId: logx!.id, agentId: graduationSniper!.id, addedBy: ownerB, isFeatured: true, displayOrder: 0 },
    { teamId: logx!.id, agentId: clobMM!.id, addedBy: ownerB, displayOrder: 1 },
    { teamId: logx!.id, agentId: orderbookAnalyst!.id, addedBy: ownerB, displayOrder: 2 },
    { teamId: logx!.id, agentId: contractDeployer!.id, addedBy: ownerB, displayOrder: 3 },
    { teamId: logx!.id, agentId: analyticsModule!.id, addedBy: ownerB, displayOrder: 4 },
  ]);

  // Elixir DEX team
  await db.insert(teamAgents).values([
    { teamId: elixirDex!.id, agentId: leaderboard!.id, addedBy: ownerC, isFeatured: true, displayOrder: 0 },
    { teamId: elixirDex!.id, agentId: orderbookAnalyst!.id, addedBy: ownerC, displayOrder: 1 },
    { teamId: elixirDex!.id, agentId: questDesigner!.id, addedBy: ownerC, displayOrder: 2 },
    { teamId: elixirDex!.id, agentId: themeAgent!.id, addedBy: ownerC, displayOrder: 3 },
  ]);

  console.log("Team agents seeded");
  console.log("Seed complete!");

  await client.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
