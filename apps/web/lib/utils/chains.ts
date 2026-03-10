export const SUPPORTED_CHAINS = {
  arbitrum: { id: 42161, name: "Arbitrum One", icon: "⬡" },
  optimism: { id: 10, name: "Optimism", icon: "🔴" },
  base: { id: 8453, name: "Base", icon: "🔵" },
  mantle: { id: 5000, name: "Mantle", icon: "🟢" },
  polygon: { id: 137, name: "Polygon", icon: "🟣" },
} as const;

export type ChainKey = keyof typeof SUPPORTED_CHAINS;

export function getChainName(key: string): string {
  const chain = SUPPORTED_CHAINS[key as ChainKey];
  return chain?.name ?? key;
}
