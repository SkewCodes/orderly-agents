"use client";

import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { injected } from "wagmi/connectors";
import { trpc } from "@/lib/trpc/client";
import { createSiweMessage } from "@/lib/auth/siwe";

export function useWallet() {
  const { address, isConnected, chain } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const sessionQuery = trpc.auth.session.useQuery();
  const nonceQuery = trpc.auth.getNonce.useQuery(undefined, {
    enabled: false,
  });
  const verifyMutation = trpc.auth.verify.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();
  const utils = trpc.useUtils();

  const isAuthenticated = !!sessionQuery.data?.walletAddress;

  async function signIn() {
    let addr = address;
    let chainId = chain?.id ?? 42161;

    if (!isConnected) {
      const result = await connectAsync({ connector: injected() });
      addr = result.accounts[0];
      chainId = result.chainId;
    }

    if (!addr) throw new Error("No wallet address");

    const { nonce } = await nonceQuery.refetch().then((r) => r.data!);
    const message = createSiweMessage(addr, chainId, nonce);
    const signature = await signMessageAsync({ message });

    await verifyMutation.mutateAsync({ message, signature });
    await utils.auth.session.invalidate();
  }

  async function signOut() {
    await logoutMutation.mutateAsync();
    await disconnectAsync();
    await utils.auth.session.invalidate();
  }

  return {
    address: sessionQuery.data?.walletAddress ?? address,
    isConnected,
    isAuthenticated,
    isLoading: sessionQuery.isLoading,
    signIn,
    signOut,
  };
}
