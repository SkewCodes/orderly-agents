---
name: bridge-monitor
version: "1.0.0"
description: "Cross-chain bridge monitor for Orderly infrastructure. Tracks stuck transactions, volume spikes, and health degradation across supported bridges."
division: infra
runtime: hosted
riskLevel: low
author: InfraWatch
supportedChains: [all]
tags: [bridge, cross-chain, monitoring, alerts, infra]
---

## Overview

The Bridge Monitor is a hosted service that watches cross-chain bridge activity for Orderly infrastructure. It detects stuck transactions, unusual volume spikes, and health degradation, and emits alerts for operational response. It runs continuously in the infra division with low risk to production systems.

## Tools / Features

| Capability | Description |
|------------|-------------|
| **Bridge coverage** | Monitors supported bridges (see below) for deposit/withdraw flows |
| **Alert types** | Stuck tx, volume spikes, health degradation, latency anomalies |
| **Monitoring methodology** | Heartbeat checks, tx confirmation tracking, volume baselines |
| **Configuration** | Thresholds, alert channels, and bridge-specific settings |

## Supported Bridges

| Bridge | Chains | Notes |
|--------|--------|------|
| **LayerZero** | Arbitrum, BSC, Ethereum, etc. | Message delivery and confirmation tracking |
| **Stargate** | Multi-chain | Liquidity and swap bridge monitoring |
| **Wormhole** | 20+ chains | VAA finality and guardian attestation |
| **Orderly native** | NEAR, Arbitrum | Custom bridge flows for Orderly |

Additional bridges may be added via configuration. Each bridge has its own health checks and alert rules.

## Alert Types

| Alert | Trigger | Severity |
|-------|---------|----------|
| **Stuck tx** | Transaction pending beyond threshold (e.g., 30 min) | High |
| **Volume spike** | Hourly/daily volume exceeds N× baseline | Medium |
| **Health degradation** | Bridge API unreachable or error rate elevated | High |
| **Latency anomaly** | Confirmation time exceeds P99 baseline | Medium |
| **Liquidity low** | Bridge liquidity below configured minimum | Medium |

## Monitoring Methodology

1. **Heartbeat**: Periodic health checks to bridge APIs and RPC endpoints.
2. **Tx tracking**: Monitor pending txs by hash; alert if not confirmed within threshold.
3. **Volume baselines**: Compute rolling 7d average; alert on configurable multiplier.
4. **Error rate**: Track 4xx/5xx and RPC errors; alert when above threshold.
5. **Latency**: Measure time-to-confirmation; alert on P99 exceedance.

## Configuration

```yaml
bridges:
  - name: layerzero
    enabled: true
    chains: [arbitrum, ethereum, bsc]
    stuckTxThresholdMinutes: 30
  - name: wormhole
    enabled: true
    chains: [arbitrum, solana]
    stuckTxThresholdMinutes: 45

alerts:
  volumeSpikeMultiplier: 3.0
  healthCheckIntervalSeconds: 60
  channels:
    - type: slack
      webhook: ${SLACK_WEBHOOK}
    - type: pagerduty
      integrationKey: ${PAGERDUTY_KEY}
```

- **bridges**: List of bridges to monitor with per-bridge thresholds.
- **alerts**: Volume spike multiplier, check interval, and notification channels.
- **Environment**: Webhook URLs and API keys via env vars; no secrets in config.
