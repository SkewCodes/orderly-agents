"use client";

import { useWallet } from "@/hooks/use-wallet";
import { truncateAddress } from "@/lib/utils/format";

export function WalletConnect() {
  const { address, isAuthenticated, isLoading, signIn, signOut } = useWallet();

  if (isLoading) {
    return (
      <div className="h-9 w-28 animate-shimmer rounded-full bg-white/[0.04]" />
    );
  }

  if (isAuthenticated && address) {
    return (
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 rounded-full bg-white/[0.04] px-3.5 py-[7px] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.06)]">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
          <span className="font-mono text-[12px] tracking-wide text-text-secondary">
            {truncateAddress(address)}
          </span>
        </div>
        <button
          onClick={signOut}
          className="rounded-full px-3.5 py-[7px] text-[12px] font-medium text-text-muted transition-all duration-200 hover:bg-white/[0.04] hover:text-text-secondary"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signIn}
      className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-5 py-[8px] text-[13px] font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.2),0_1px_2px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.35),0_1px_2px_rgba(0,0,0,0.3)] hover:brightness-110"
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent opacity-100" />
      <span className="relative">Connect Wallet</span>
    </button>
  );
}
