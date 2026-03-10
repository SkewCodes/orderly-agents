---
name: orderbook-analyst
version: "1.0.0"
description: "Analyzes orderbook depth, liquidity zones, spread history, and spoofing via MCP. Use when examining market microstructure, detecting manipulation, or assessing trading conditions."
division: analytics
runtime: mcp
riskLevel: low
author: FlowTrader
supportedChains: [all]
tags: [orderbook, liquidity, spread, spoofing, market-microstructure]
---

# Orderbook Analyst

Analyze orderbook data, liquidity zones, spread dynamics, and spoofing patterns through MCP tools. Use this skill when working with orderbook depth, market microstructure, or manipulation detection.

## MCP Tools

| Tool | Purpose |
|------|---------|
| `analyzeOrderbook` | Full orderbook depth analysis: bid/ask imbalance, depth at levels, volume concentration |
| `findLiquidityZones` | Identify clusters of liquidity (support/resistance) from orderbook data |
| `getSpreadHistory` | Historical bid-ask spread and spread volatility over time |
| `detectSpoofing` | Flag potential spoofing/layering patterns (fake orders placed and cancelled) |

## Usage Examples with Claude

### Analyze current orderbook depth

```
User: What's the orderbook imbalance for ETH-PERP on Arbitrum?

Claude: [Calls analyzeOrderbook with symbol: "ETH-PERP", chain: "arbitrum"]
Returns: Bid/ask depth, imbalance ratio, top N levels, volume-weighted mid.
```

### Find liquidity zones

```
User: Where are the main liquidity clusters for BTC-PERP?

Claude: [Calls findLiquidityZones with symbol: "BTC-PERP", depth: 20]
Returns: Price levels with concentrated liquidity, cluster strength scores.
```

### Check spread history

```
User: How has the spread on SOL-PERP changed over the last 24h?

Claude: [Calls getSpreadHistory with symbol: "SOL-PERP", period: "24h"]
Returns: Spread time series, min/max/avg spread, volatility.
```

### Detect spoofing

```
User: Are there spoofing patterns on this market in the last hour?

Claude: [Calls detectSpoofing with symbol: "ETH-PERP", window: "1h"]
Returns: Flagged addresses/orders, spoof score, timestamps.
```

## Workflow Patterns

1. **Pre-trade analysis**: `analyzeOrderbook` → `findLiquidityZones` → assess slippage risk
2. **Manipulation check**: `detectSpoofing` → `getSpreadHistory` → correlate anomalies
3. **Market quality**: `getSpreadHistory` → `analyzeOrderbook` → liquidity vs spread report

## Output Format

When presenting orderbook analysis, include:
- **Imbalance**: Bid/ask ratio and interpretation (e.g., >1.2 = bid-heavy)
- **Liquidity zones**: Top 3–5 levels with size and distance from mid
- **Spread**: Current and historical context (tight vs wide)
- **Spoofing**: Clear yes/no with confidence and evidence summary
