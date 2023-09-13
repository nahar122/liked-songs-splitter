import { router } from "~/server/api/trpc";
import { protectedRouter } from "./routers/example";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  example: protectedRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
