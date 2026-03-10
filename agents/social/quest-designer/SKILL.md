---
name: quest-designer
version: "1.0.0"
description: "Designs quests and achievements: quest types, completion tracking, and reward campaigns. Use when building gamification, onboarding, or engagement programs."
division: social
runtime: skill
riskLevel: low
author: 52kskew
supportedChains: [all]
tags: [quest, achievement, gamification, rewards, campaigns]
---

# Quest Designer

Design quests, achievements, and reward campaigns for trading and DeFi apps. Use this skill when building gamification, onboarding flows, or engagement programs.

## Quest Types

| Type | Description | Example |
|------|-------------|---------|
| **One-shot** | Single action, one-time completion | "Place your first order" |
| **Progressive** | Multi-step sequence | "Deposit → Trade → Withdraw" |
| **Cumulative** | Threshold over time | "Trade 10,000 USDC volume" |
| **Daily/Weekly** | Recurring | "Trade 3 days in a row" |
| **Competitive** | Rank-based | "Finish in top 100 this week" |
| **Social** | Referral or shared | "Invite 3 friends who trade" |
| **Hidden** | Secret conditions | "Lose <5% in a single trade" |

## Completion Tracking

### Event Sources
- **On-chain**: Txs, deposits, swaps, position changes
- **Off-chain**: API calls, orderbook, trade events
- **Hybrid**: Match order events + settlement txs

### State Machine
```
not_started → in_progress → completed → claimed
                ↓
            expired (optional)
```

### Idempotency
- Use `(user_id, quest_id)` as unique key
- Store `progress`, `completed_at`, `claimed_at`
- Recompute progress on each relevant event; update only if increased

### Progress Logic
```typescript
// Cumulative example
progress = min(required, current_value);
completed = progress >= required;

// Progressive example
current_step = index of first incomplete step;
completed = current_step >= steps.length;
```

## Reward Campaigns

### Reward Types
- **Points**: Internal currency for future rewards
- **Tokens**: Native or ERC-20 airdrop
- **NFTs**: Badges, collectibles
- **Discounts**: Fee rebates, VIP tiers
- **Access**: Early features, private channels

### Campaign Structure
1. **Campaign**: Container (e.g., "March Trading Quest")
2. **Quests**: Individual objectives within campaign
3. **Rewards**: Per-quest or campaign-level rewards
4. **Schedule**: Start/end dates, claim deadline

### Claim Flow
- User completes quest → `completed` state
- User triggers claim → verify completion → send reward
- Optional: vesting, cooldown, or KYC gate

## Output Format

When designing a quest:
- **ID**: Unique slug (e.g., `first-trade`)
- **Type**: One-shot, progressive, cumulative, etc.
- **Title & description**: User-facing text
- **Conditions**: Exact completion criteria
- **Reward**: Type and amount
- **Expiry**: Optional end date or recurrence
