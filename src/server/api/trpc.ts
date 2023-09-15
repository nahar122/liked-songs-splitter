import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import {
  getAuth,
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

interface AuthContext {
  auth: SignedInAuthObject | SignedOutAuthObject;
}

export const createContextInner = ({ auth }: AuthContext) => {
  return {
    auth,
  };
};

export const createContext = (opts: trpcNext.CreateNextContextOptions) => {
  const auth = getAuth(opts.req);
  // console.log("Debug: Auth is", auth);
  const authContext = createContextInner({
    auth: auth,
  });

  return authContext;
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

// check if the user is signed in, otherwise throw a UNAUTHORIZED CODE
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  // console.log("ASDLFKJALDKF");
  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});

export const router = t.router;

export const publicProcedure = t.procedure;

// export this procedure to be used anywhere in your application
export const protectedProcedure = t.procedure.use(isAuthed);
