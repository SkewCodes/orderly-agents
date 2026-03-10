---
name: whale-watcher
version: "1.0.0"
description: "Tracks whale activity via on-chain analysis, accumulation patterns, and smart money identification. Use when monitoring large traders, alpha signals, or market-moving flows."
division: analytics
runtime: skill
riskLevel: low
author: FlowTrader
supportedChains: [all]
tags: [whale, on-chain, accumulation, smart-money, flow]
---

# Whale Watcher

Track whale activity, accumulation patterns, and smart money flows using on-chain analysis techniques. Use this skill when monitoring large traders, identifying alpha, or assessing market-moving flows.

## On-Chain Analysis Techniques

### Address Clustering
- **Entity resolution**: Group addresses by EOA, multisig, CEX hot/cold wallets
- **Label sources**: Etherscan, Arkham, Nansen, Dune labels
- **Heuristics**: Same funding source, similar tx patterns, contract interactions

### Flow Metrics
- **Inflow/outflow**: Net volume into/out of an asset over windows (1h, 24h, 7d)
- **Exchange flows**: Deposits vs withdrawals to CEXs (accumulation vs distribution)
- **DEX swaps**: Large single swaps, cumulative swap volume per address

### Position Sizing
- **Whale threshold**: Top N% by position size or volume (e.g., top 1% = whale)
- **Concentration**: Herfindahl index of position distribution
- **New vs existing**: First-time vs repeat large positions

## Accumulation Patterns

| Pattern | Description | Signal |
|---------|-------------|--------|
| **DCA accumulation** | Regular buys at fixed intervals | Long-term conviction |
| **Dip buying** | Large buys on >5% drawdowns | Value-seeking |
| **Breakout accumulation** | Buys on new highs | Momentum following |
| **Exchange outflow** | Withdrawals from CEX without selling | Custody / holding |
| **Otc / private** | Off-exchange large transfers | Institutional / OTC |

## Smart Money Identification

1. **Historical PnL**: Addresses with consistent profitable exits
2. **Timing**: Entries before pumps, exits before dumps
3. **Copy-trading**: Addresses that others copy (e.g., GMX, Hyperliquid)
4. **Cross-asset**: Same address profitable across multiple assets
5. **Latency**: Early vs late to new pools/tokens

## Output Format

When reporting whale activity:
- **Who**: Address (or label), cluster, size tier
- **What**: Action (buy/sell/transfer), size, venue
- **When**: Timestamp, recency
- **Context**: Pattern type, historical behavior, risk level
