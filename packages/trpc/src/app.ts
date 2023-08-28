// Imports
//////////////////////////////////////////
import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import { ironSession } from "iron-session/express";
import appRouter from "./router";

//Context
//////////////////////////////////////////
///////// Context to interpret how requests are handled with express
export const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

//Constants
//////////////////////////////////////////
const app = express();

// Config
//////////////////////////////////////////
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => callback(null, true),
  })
);
app.use(
  ironSession({
    cookieName: "siwe",
    // has to be 32 chars long
    password:
      process.env.IRON_SESSION_SECRET || "UNKNOWN_IRON_SESSION_PASSWORD_32",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  })
);
// Routes
//////////////////////////////////////////
app.get("/healthz", (_req, res) => {
  return res.json({ ok: true });
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({ router: appRouter, createContext })
);

// Exports
//////////////////////////////////////////

export default app;
