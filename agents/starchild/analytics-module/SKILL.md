---
name: analytics-module
version: "1.0.0"
description: "Analytics dashboard generator for DEX metrics. Produces volume, retention, PnL charts with Orderly data integration and React components."
division: starchild
runtime: mcp
author: Starchild AI
supportedChains: [all]
tags: [analytics, charts, volume, retention, pnl, orderly]
---

## Overview

The Analytics Module generates analytics dashboards and chart components for DEX applications. It supports volume, retention, and PnL visualizations, integrates with Orderly data sources, and outputs ready-to-use React components. Use it to add trading analytics, user metrics, and performance views to your DEX frontend.

## Tools / Features

| Capability | Description |
|------------|-------------|
| **Chart types** | Volume (bar/line), retention (cohort), PnL (line/area), open interest, funding rates |
| **Orderly data integration** | Connects to Orderly APIs for trades, positions, funding, and market data |
| **React component generation** | Produces Recharts, Chart.js, or custom SVG-based components |
| **Dashboard scaffolding** | Full dashboard layouts with filters, date ranges, and export options |

## Usage

### Example Prompts

- *"Create a volume chart showing 24h trading volume by hour for the selected market."*
- *"Build a PnL chart for a user's positions over the last 7 days."*
- *"Generate a retention dashboard: cohort by first-trade date, retention at 1d, 7d, 30d."*
- *"Add an analytics section with volume, open interest, and funding rate charts."*
- *"Create a React component that fetches Orderly trade data and displays a volume bar chart."*

### Chart Types

| Type | Use Case | Data Source |
|------|----------|-------------|
| **Volume** | Trading activity over time | Orderly trades, market stats |
| **Retention** | User return rates by cohort | Orderly user/trade history |
| **PnL** | Profit/loss over time | Orderly positions, settlements |
| **Open interest** | Open positions by market | Orderly positions |
| **Funding** | Funding rate history | Orderly funding data |

## Configuration

- **Chart library**: Specify `recharts`, `chartjs`, or `custom` for component output.
- **Orderly endpoint**: Set API base URL for data fetching (defaults to production if not specified).
- **Time range**: Default ranges (24h, 7d, 30d) can be customized per chart.
- **Refresh interval**: Optional polling interval for live dashboards.
