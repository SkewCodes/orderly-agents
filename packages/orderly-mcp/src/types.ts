export interface OrderlyMCPTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export const ORDERLY_MCP_TOOLS: OrderlyMCPTool[] = [
  {
    name: "orderly:getOrderbook",
    description: "Fetch L2 orderbook for any pair",
    parameters: { symbol: { type: "string" }, depth: { type: "number" } },
  },
  {
    name: "orderly:getMarketData",
    description: "Ticker, 24h volume, funding rates",
    parameters: { symbol: { type: "string" } },
  },
  {
    name: "orderly:getPositions",
    description: "User's open positions",
    parameters: {},
  },
  {
    name: "orderly:getBalances",
    description: "User's asset balances",
    parameters: {},
  },
  {
    name: "orderly:placeOrder",
    description: "Submit limit/market order",
    parameters: {
      symbol: { type: "string" },
      side: { type: "string" },
      type: { type: "string" },
      price: { type: "number" },
      quantity: { type: "number" },
    },
  },
  {
    name: "orderly:cancelOrder",
    description: "Cancel an open order",
    parameters: { orderId: { type: "string" } },
  },
  {
    name: "orderly:getTradeHistory",
    description: "Recent fills",
    parameters: { symbol: { type: "string" }, limit: { type: "number" } },
  },
  {
    name: "orderly:getAvailablePairs",
    description: "List all trading pairs",
    parameters: {},
  },
];
