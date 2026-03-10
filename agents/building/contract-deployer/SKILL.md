---
name: contract-deployer
version: "1.0.0"
description: "Guides contract deployment via MCP: broker registration, vault setup, and cross-chain deployment. Use when deploying Orderly infrastructure or configuring trading contracts."
division: building
runtime: mcp
riskLevel: low
author: Orderly Core
supportedChains: [all]
tags: [deployment, broker, vault, cross-chain, contracts]
---

# Contract Deployer

Deploy and configure Orderly trading contracts via MCP. Use this skill when setting up brokers, vaults, or performing cross-chain deployments.

## MCP Tools

| Tool | Purpose |
|------|---------|
| `registerBroker` | Register a broker with the Orderly network |
| `setupVault` | Configure vault parameters and permissions |
| `deployCrossChain` | Deploy contracts across supported chains |
| `verifyDeployment` | Verify deployed contract addresses and config |

## Broker Registration

1. **Prerequisites**
   - Broker admin keypair
   - Chain IDs for target networks
   - Broker metadata (name, fee config, allowed markets)

2. **Registration flow**
   - Call `registerBroker` with broker config
   - Submit registration tx on each target chain
   - Confirm broker appears in registry

3. **Post-registration**
   - Configure allowed symbols and risk limits
   - Set fee tiers and referral rules
   - Enable/disable markets per chain

## Vault Setup

1. **Vault creation**
   - Deploy vault contract or use factory
   - Set vault name, symbol, and fee structure

2. **Permissions**
   - Grant deposit/withdraw to allowed users
   - Configure manager vs admin roles
   - Set rebalance and strategy permissions

3. **Integration**
   - Connect vault to Orderly engine
   - Configure collateral and margin rules
   - Test deposit → trade → withdraw flow

## Cross-Chain Deployment Steps

1. **Prepare**
   - Compile contracts for each target chain
   - Resolve constructor args (registry, chain ID, etc.)
   - Prepare deployment script or MCP sequence

2. **Deploy**
   - Deploy on primary chain first (e.g., Arbitrum)
   - Record deployed addresses
   - Deploy on secondary chains (e.g., Base, Linea)

3. **Verify**
   - Call `verifyDeployment` for each chain
   - Confirm addresses match expected bytecode
   - Check registry entries and permissions

4. **Post-deploy**
   - Update config files with new addresses
   - Run smoke tests per chain
   - Document deployment manifest

## Output Format

When guiding deployment:
- **Step**: Numbered, clear action
- **Tool/Command**: Exact MCP call or CLI command
- **Params**: Required arguments and example values
- **Check**: How to verify success
