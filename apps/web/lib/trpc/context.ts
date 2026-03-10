import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export interface SessionData {
  walletAddress?: string;
  publisherId?: string;
  nonce?: string;
}

const sessionOptions = {
  password:
    process.env.SESSION_SECRET ?? "complex_password_at_least_32_characters_long",
  cookieName: "orderly-agents-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  },
};

export async function createContext(_opts?: FetchCreateContextFnOptions) {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions
  );

  return {
    db,
    session,
    walletAddress: session.walletAddress ?? null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
