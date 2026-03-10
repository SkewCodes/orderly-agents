import { router } from "./trpc";
import { agentsRouter } from "./routers/agents";
import { teamsRouter } from "./routers/teams";
import { publishersRouter } from "./routers/publishers";
import { authRouter } from "./routers/auth";

export const appRouter = router({
  agents: agentsRouter,
  teams: teamsRouter,
  publishers: publishersRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
