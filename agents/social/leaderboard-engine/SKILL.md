---
name: leaderboard-engine
version: "1.0.0"
description: "Designs leaderboards with ranking algorithms, anti-gaming, reward distribution, and React components. Use when building trading competitions or gamified rankings."
division: social
runtime: skill
riskLevel: low
author: 52kskew
supportedChains: [all]
tags: [leaderboard, ranking, anti-gaming, rewards, react]
---

# Leaderboard Engine

Design and implement leaderboards for trading competitions and gamified rankings. Use this skill when building ranking systems, reward distribution, or competition UIs.

## Ranking Algorithms

### Score Types
| Type | Formula | Use Case |
|------|---------|----------|
| **PnL** | Realized + unrealized PnL | Simple profit contests |
| **ROI** | PnL / initial margin | Fair across account sizes |
| **Sharpe** | Return / volatility | Risk-adjusted performance |
| **Volume-weighted** | PnL × log(volume) | Reward activity + profit |

### Ranking Modes
- **Absolute**: Rank by raw score (e.g., total PnL)
- **Percentile**: Rank within cohort (e.g., top 10%)
- **Tiered**: Bronze/Silver/Gold by score bands
- **Time-windowed**: Rolling 7d, 30d, all-time

### Update Frequency
- Real-time: On every trade/position change
- Batched: Every N minutes via cron
- Snapshot: Daily or at competition end

## Anti-Gaming

| Attack | Mitigation |
|--------|------------|
| **Wash trading** | Minimum unique counterparties, volume caps |
| **Sybil** | KYC, wallet fingerprinting, deposit history |
| **Sandbagging** | Minimum activity, lock-in periods |
| **Last-minute sniping** | Snapshot at random time, not EOD |
| **Self-trading** | Detect same-entity both sides |

### Rules of Thumb
- Require minimum trades and volume to qualify
- Exclude addresses with suspicious patterns
- Use multiple metrics (not just PnL) for final rank
- Audit top ranks before reward distribution

## Reward Distribution

1. **Prize pool**: Fixed or % of fees
2. **Allocation**: Top N get X%, next tier Y%, etc.
3. **Vesting**: Immediate vs locked (e.g., 30d vest)
4. **Eligibility**: Min score, min activity, KYC if required

### Example Allocation
```
Top 1:  20%
Top 5:  15% each (75% total)
Top 10: 5% each (50% total)
Top 50: 1% each (50% total)
```

## React Components

### LeaderboardTable
```tsx
<LeaderboardTable
  data={rankings}
  columns={['rank', 'address', 'pnl', 'roi', 'volume']}
  sortBy="pnl"
  onRowClick={(row) => openProfile(row.address)}
/>
```

### RankBadge
```tsx
<RankBadge rank={1} />  // Gold
<RankBadge rank={2} />  // Silver
<RankBadge rank={3} />  // Bronze
```

### TimeRangeSelector
```tsx
<TimeRangeSelector
  options={['24h', '7d', '30d', 'all']}
  value={range}
  onChange={setRange}
/>
```

### Props to Support
- `compact` — Minimal columns for mobile
- `highlightAddress` — Highlight current user
- `loading` — Skeleton state
- `emptyMessage` — When no data
