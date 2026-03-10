---
name: dex-vibe-coder
version: "1.0.0"
description: "Vibe-coding agent for DEX frontends. Generates trading views, portfolio dashboards, and SDK-integrated components using intuitive prompts and MCP tools."
division: starchild
runtime: mcp
author: Starchild AI
supportedChains: [all]
tags: [dex, frontend, vibe-coding, trading, ui]
---

## Overview

The DEX Vibe Coder is an MCP-powered agent that enables **vibe coding**—building decentralized exchange (DEX) frontends through natural language prompts and high-level tool calls rather than writing low-level code by hand. It understands trading UX patterns, Orderly SDK conventions, and modern React/TypeScript best practices to scaffold and refine DEX interfaces quickly.

**What is vibe coding?** Vibe coding is an iterative, prompt-driven development style where you describe the experience you want (e.g., "a dark trading view with order book and chart") and the agent produces working components, wires up SDK calls, and applies themes. You refine by vibe—"make it feel more aggressive" or "add a subtle gradient"—rather than by editing raw CSS or component props.

## Tools / Features

| Tool | Purpose |
|------|---------|
| `generateComponent` | Creates React components (order book, trade form, chart wrapper) from a description |
| `scaffoldPage` | Builds full page layouts (trading view, portfolio dashboard) with routing and layout |
| `integrateSDK` | Connects Orderly SDK (order placement, balances, positions) to existing components |
| `applyTheme` | Applies design tokens, CSS variables, or DEX Builder themes to components |

## Usage

### Example Prompts for Trading Views

- *"Build a trading view with order book on the left, chart in the center, and trade form on the right. Dark theme with green/red for buy/sell."*
- *"Add a compact order entry form with market/limit toggle and slippage selector."*
- *"Create a responsive trading layout that stacks on mobile: chart first, then order book, then trade form."*
- *"Wire up the trade form to Orderly SDK for placing market and limit orders."*

### Example Prompts for Portfolio Dashboards

- *"Scaffold a portfolio dashboard with positions table, PnL summary, and open orders."*
- *"Add a balance card showing USDC and collateral with deposit/withdraw buttons."*
- *"Create a portfolio page with tabs: Positions, Orders, History, Funding."*
- *"Integrate Orderly SDK to fetch and display real positions and order history."*

### Workflow Tips

1. Start with `scaffoldPage` for structure, then use `generateComponent` for specific blocks.
2. Use `integrateSDK` after layout is in place to avoid re-scaffolding.
3. Use `applyTheme` last to align with DEX Builder or custom design tokens.

## Configuration

No configuration required. The agent uses project context (e.g., existing Orderly SDK setup) when available. For custom SDK endpoints or chains, ensure environment variables or config are set in the host project.
