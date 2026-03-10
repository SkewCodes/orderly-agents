"use client";

import { SiweMessage } from "siwe";

export function createSiweMessage(
  address: string,
  chainId: number,
  nonce: string
) {
  const message = new SiweMessage({
    domain: typeof window !== "undefined" ? window.location.host : "",
    address,
    statement: "Sign in to OrderlyAgents",
    uri: typeof window !== "undefined" ? window.location.origin : "",
    version: "1",
    chainId,
    nonce,
  });
  return message.prepareMessage();
}
