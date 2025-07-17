import "server-only";

import { accountsRouter } from "./routers/accounts";
import { calendarsRouter } from "./routers/calendars";
import { conferencingRouter } from "./routers/conferencing";
import { earlyAccessRouter } from "./routers/early-access";
import { eventsRouter } from "./routers/events";
import { userRouter } from "./routers/user";
import {
  createCallerFactory,
  createTRPCContext,
  createTRPCRouter,
} from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  accounts: accountsRouter,
  calendars: calendarsRouter,
  events: eventsRouter,
  conferencing: conferencingRouter,
  earlyAccess: earlyAccessRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
export const createContext = createTRPCContext;
