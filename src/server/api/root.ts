import { createTRPCRouter } from "~/server/api/trpc";
import { splitSchemaRouter } from "./routers/splitSchemas";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  splitSchema: splitSchemaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
