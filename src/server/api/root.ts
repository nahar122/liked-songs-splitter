import { router } from "~/server/api/trpc";
import { spotifyRouter, clerkRouter } from "./routers/test";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  clerkRouter: clerkRouter,
  spotifyAppRouter: spotifyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
