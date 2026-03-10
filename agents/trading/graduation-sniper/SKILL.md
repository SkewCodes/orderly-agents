---
name: graduation-sniper
version: "1.0.0"
description: "Graduation sniper agent for Velocity. Snipes newly graduated markets at launch. Tier 3 hosted. Use when configuring or understanding graduation sniping, Velocity prediction markets, or pre-launch positioning."
division: trading
runtime: hosted
riskLevel: high
author: Orderly Agents
supportedChains: [arbitrum, base]
tags: [velocity, prediction-markets, graduation, sniping, perp]
---

# Graduation Sniper Agent

## Overview

The graduation sniper is a Tier 3 hosted agent that executes trades at the moment a Velocity prediction market graduates from pre-launch to live trading. It capitalizes on the brief window between graduation announcement and order book population, capturing early liquidity and favorable fills.

## How Graduation Events Work

1. **Pre-launch phase**: Velocity markets exist in a pre-launch state with limited or no trading. Resolution criteria and graduation conditions are defined on-chain.
2. **Graduation trigger**: When resolution criteria are met (e.g., oracle confirms outcome, time threshold passes), the protocol emits a graduation event.
3. **Event propagation**: The event is indexed and broadcast. The sniper listens for these events in real time.
4. **Post-graduation**: The market becomes tradeable on the CLOB. Early orders face thin liquidity and wide spreads.

## Snipe Strategy

- **Event-driven execution**: Subscribe to graduation events via indexer or RPC. No polling.
- **Pre-positioning**: Optionally place limit orders in pre-launch if the venue supports it, or prepare signed transactions.
- **Immediate execution**: On event receipt, submit market or aggressive limit orders within milliseconds.
- **Size scaling**: Position size scales with estimated post-graduation liquidity to avoid excessive slippage.

## Risk Parameters

| Parameter | Description | Typical Range |
|-----------|-------------|---------------|
| `maxSlippageBps` | Maximum acceptable slippage in basis points | 50–200 bps |
| `maxPositionSizeUsd` | Cap per snipe in USD | 500–5000 |
| `cooldownMs` | Minimum time between snipes per market | 1000–5000 |
| `blacklistMarkets` | Markets to skip (low liquidity, high manipulation risk) | Configurable |

## Configuration

```yaml
graduationSniper:
  enabled: true
  maxSlippageBps: 100
  maxPositionSizeUsd: 2000
  cooldownMs: 2000
  useMarketOrders: true
  fallbackToLimit: true
  limitOrderTtlMs: 5000
```

## Risk Warning

Graduation sniping is high risk. Newly graduated markets have thin liquidity; fills can be worse than expected. Front-running and MEV bots may compete. Only deploy with capital you can afford to lose.
