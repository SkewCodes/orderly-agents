---
name: copy-trade-engine
version: "1.0.0"
description: "Copy trade engine that replicates leader wallet positions proportionally. Tier 3 hosted. Use when configuring copy trading, leader selection, or trade replication."
division: trading
runtime: hosted
riskLevel: high
author: Orderly Agents
supportedChains: [arbitrum, base]
tags: [copy-trading, leader, replication, proportional, risk-caps]
---

# Copy Trade Engine Agent

## Overview

The copy trade engine is a Tier 3 hosted agent that replicates trades from selected leader wallets onto a follower account. It selects leaders by performance and risk metrics, then executes proportional copies of their positions within configurable risk caps.

## Leader Wallet Selection

Leaders are chosen and ranked by:

- **Performance**: PnL over rolling windows (7d, 30d). Prefer consistent positive returns.
- **Win rate**: Percentage of profitable trades. Used as a filter, not sole criterion.
- **Drawdown**: Maximum peak-to-trough decline. Exclude leaders with excessive drawdowns.
- **Activity**: Minimum trade count. Inactive leaders are deprioritized or removed.
- **Correlation**: Avoid highly correlated leaders to reduce concentration risk.

Selection can be manual (whitelist) or automated (score-based with min thresholds).

## Proportional Trade Replication

- **Size scaling**: Follower size = Leader size × (Follower equity / Leader equity) × `allocationPct`.
- **Direction**: Same side (long/short) as leader.
- **Symbol**: Same market. Unsupported symbols are skipped.
- **Timing**: Execute as soon as leader trade is detected (indexer or event stream). Latency matters.

## Risk Caps

| Parameter | Description | Purpose |
|-----------|-------------|---------|
| `maxAllocationPerLeader` | Max % of follower equity allocated to one leader | Diversification |
| `maxTotalExposureUsd` | Total notional exposure cap | Capital preservation |
| `maxDrawdownPct` | Stop copying if follower drawdown exceeds | Circuit breaker |
| `maxPositionSizeUsd` | Per-trade size cap | Slippage and liquidity |
| `leaderBlacklist` | Addresses to never copy | Safety |

## Configuration

```yaml
copyTradeEngine:
  enabled: true
  leaders: ["0x...", "0x..."]
  allocationPct: 0.5
  maxAllocationPerLeader: 0.3
  maxTotalExposureUsd: 10000
  maxDrawdownPct: 0.15
  maxPositionSizeUsd: 2000
  minLeaderEquityUsd: 5000
  replicationDelayMs: 500
```

## Risk Warning

Copy trading amplifies leader risk. Past performance does not guarantee future results. Leaders can have large drawdowns. Use strict risk caps and only allocate capital you can afford to lose.
