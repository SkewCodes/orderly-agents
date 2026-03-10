---
name: liquidation-hunter
version: "1.0.0"
description: "Liquidation hunter that monitors thresholds and positions counter-trades. Tier 3 hosted. Use when configuring liquidation strategies, cascade detection, or counter-trade positioning."
division: trading
runtime: hosted
riskLevel: degen
author: Orderly Agents
supportedChains: [arbitrum, base]
tags: [liquidation, cascade, counter-trade, health-factor, margin]
---

# Liquidation Hunter Agent

## Overview

The liquidation hunter is a Tier 3 hosted agent that monitors positions approaching liquidation thresholds and executes counter-trades to profit from liquidations. It tracks health factors, margin ratios, and cascade risk to time entries and size positions.

## Liquidation Threshold Monitoring

- **Health factor**: `HF = (Collateral × Liquidation threshold) / Debt`. When HF < 1, position is liquidatable.
- **Margin ratio**: `MR = (Equity - Maintenance margin) / Maintenance margin`. Negative margin triggers liquidation.
- **Monitoring**: Poll or subscribe to position updates. Track distance to liquidation (e.g., price move required to trigger).
- **Alert threshold**: Define "at risk" (e.g., HF < 1.2) to pre-position before actual liquidation.

## Counter-Trade Positioning

- **Direction**: Take the opposite side of positions likely to be liquidated. If longs are at risk, go short.
- **Size**: Scale with estimated liquidation volume. Avoid over-sizing relative to expected cascade.
- **Timing**: Enter before or as liquidations occur. Early entries capture more of the move; late entries face slippage.

## Cascade Detection

- **Cascade**: Large liquidations push price, triggering more liquidations in a feedback loop.
- **Signals**: Sudden drop in aggregate health factor, spike in liquidation volume, rapid price move.
- **Response**: Widen position or add when cascade is detected; reduce when cascade subsides.
- **Risk**: Cascades can reverse sharply. Use stop-losses and position limits.

## Configuration

```yaml
liquidationHunter:
  enabled: true
  symbols: ["PERP_ETH_USDC", "PERP_BTC_USDC"]
  healthFactorAlertThreshold: 1.2
  minLiquidationSizeUsd: 1000
  maxPositionSizeUsd: 5000
  cascadeDetectionWindowMs: 5000
  cascadeVolumeThresholdUsd: 50000
  stopLossPct: 0.05
  cooldownAfterCascadeMs: 30000
```

## Risk Warning

Liquidation hunting is extremely risky (degen tier). Cascades are unpredictable; counter-trades can lose heavily if price reverses. MEV and liquidator bots compete. Only for experienced traders with risk capital.
