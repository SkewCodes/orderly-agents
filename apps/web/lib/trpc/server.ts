import "server-only";
import { createContext } from "./context";
import { appRouter } from "./router";

export async function serverCaller() {
  const ctx = await createContext();
  return appRouter.createCaller(ctx);
}
