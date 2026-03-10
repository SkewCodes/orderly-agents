---
name: sdk-assistant
version: "1.0.0"
description: "Assists with Orderly SDK integration: API patterns, common flows, and best practices. Use when building trading bots, UIs, or integrating with Orderly."
division: building
runtime: skill
riskLevel: low
author: Orderly Core
supportedChains: [all]
tags: [sdk, api, integration, trading, orderly]
---

# Orderly SDK Assistant

Helps integrate the Orderly SDK for trading, account management, and market data. Use this skill when building bots, UIs, or integrating with Orderly.

## SDK API Reference Patterns

### Initialization
```typescript
import { Orderly } from '@orderly/sdk';

const orderly = new Orderly({
  networkId: 'arbitrum-mainnet',
  privateKey: process.env.PRIVATE_KEY,
});
```

### Account & Auth
- `orderly.getAccount()` — Fetch account info and balances
- `orderly.getApiKey()` — Manage API keys for trading
- `orderly.signMessage()` — Sign for authentication flows

### Market Data
- `orderly.getOrderbook(symbol)` — L2 orderbook
- `orderly.getTicker(symbol)` — Last price, 24h stats
- `orderly.getTrades(symbol)` — Recent trades
- `orderly.getMarkPrice(symbol)` — Mark and index price

### Trading
- `orderly.createOrder(params)` — Place limit/market order
- `orderly.cancelOrder(orderId)` — Cancel by ID
- `orderly.cancelAllOrders(symbol?)` — Cancel all or by symbol
- `orderly.getOpenOrders(symbol?)` — List open orders
- `orderly.getOrderHistory(params)` — Historical orders

### Positions
- `orderly.getPositions()` — All positions
- `orderly.getPosition(symbol)` — Single position
- `orderly.closePosition(symbol, size?)` — Close full or partial

## Common Integration Flows

### 1. Connect wallet and fetch account
```
init SDK → connect wallet → getAccount → getPositions
```

### 2. Place and manage orders
```
getOrderbook (optional) → createOrder → getOpenOrders → cancelOrder if needed
```

### 3. Monitor positions and PnL
```
getPositions → getMarkPrice → compute unrealized PnL
```

### 4. WebSocket subscriptions
```
connect WS → subscribe orderbook/trades/positions → handle updates
```

## Error Handling

- **401**: Invalid or expired auth — refresh key/session
- **429**: Rate limit — backoff and retry
- **400**: Bad params — validate symbol, size, price format
- **Insufficient margin**: Reduce size or add collateral

## Best Practices

- Use WebSocket for real-time data; REST for commands
- Validate symbol format (e.g., `PERP_ETH_USDC`)
- Handle reconnection for WS; implement exponential backoff
- Cache orderbook snapshots; apply deltas for live view
