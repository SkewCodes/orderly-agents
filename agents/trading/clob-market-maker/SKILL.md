---
name: clob-market-maker
version: "1.0.0"
description: "CLOB market maker for Orderly using Avellaneda-Stoikov. Tier 3 hosted. Use when configuring market making, spread dynamics, or inventory management on Orderly."
division: trading
runtime: hosted
riskLevel: medium
author: Orderly Agents
supportedChains: [arbitrum, base]
tags: [orderly, clob, market-making, avellaneda-stoikov, inventory]
---

# CLOB Market Maker Agent

## Overview

The CLOB market maker is a Tier 3 hosted agent that provides two-sided liquidity on Orderly's Central Limit Order Book. It uses the Avellaneda-Stoikov framework to set dynamic spreads and skew quotes based on inventory and volatility.

## Avellaneda-Stoikov Framework

The model derives optimal bid/ask quotes from:

- **Reservation price**: Mid price adjusted by inventory. Formula: `r = s - q * γ * σ² * (T - t)` where `s` is mid, `q` is inventory, `γ` is risk aversion, `σ` is volatility, `T - t` is time to horizon.
- **Optimal spread**: `δ = γ * σ² * (T - t) + (2/γ) * ln(1 + γ/k)` where `k` is order arrival intensity.
- **Quote placement**: Bid at `r - δ/2`, ask at `r + δ/2`.

## Dynamic Spread

- **Volatility scaling**: Spread widens when realized or implied volatility increases.
- **Time decay**: Spread narrows as time to horizon decreases (shorter exposure).
- **Liquidity adjustment**: Tighter spreads when book depth is high; wider when thin.

## Inventory Management

- **Skew**: When long, lower bid and raise ask to reduce inventory; when short, raise bid and lower ask.
- **Inventory limits**: Hard caps on net position. Beyond threshold, quotes become one-sided (only reduce inventory).
- **Emergency flatten**: Market order to reduce inventory when limits are breached.

## Multi-Level Quoting

- **Level 1**: Best bid/ask (tightest spread).
- **Level 2–N**: Additional orders at wider intervals to capture flow and improve average fill price.
- **Depth per level**: Configurable size. Total exposure across levels must respect inventory limits.

## Configuration

```yaml
clobMarketMaker:
  enabled: true
  symbols: ["PERP_ETH_USDC", "PERP_BTC_USDC"]
  riskAversion: 0.1
  orderArrivalIntensity: 1.5
  horizonSeconds: 3600
  maxInventoryBase: 10
  maxInventoryQuote: 50000
  spreadMinBps: 5
  spreadMaxBps: 50
  quoteLevels: 3
  levelSpacingBps: 10
```

## Risk Warning

Market making carries inventory and adverse selection risk. Volatile moves can cause large drawdowns. Use appropriate position limits and risk controls.
