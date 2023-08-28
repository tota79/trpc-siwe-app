import { initTRPC, inferAsyncReturnType } from "@trpc/server";
import { createContext } from "./app";

//Constants
//////////////////////////////////////////
type Context = inferAsyncReturnType<typeof createContext>;

//Config
//////////////////////////////////////////
const t = initTRPC.context<Context>().create();
const router = t.router;
const publicProcedure = t.procedure;
const mergeRouters = t.mergeRouters;

// Exports
export { Context, t, router, publicProcedure, mergeRouters };
