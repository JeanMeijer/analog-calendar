import "server-only";
import {
  createCallerFactory,
  createTRPCContext,
  createTRPCRouter,
} from "./trpc";
import { userRouter } from "./routers/user";
import { calendarsRouter } from "./routers/calendars";
import { eventsRouter } from "./routers/events";
import { earlyAccessRouter } from "./routers/early-access";

export const appRouter = createTRPCRouter({
  user: userRouter,
  calendars: calendarsRouter,
  events: eventsRouter,
  earlyAccess: earlyAccessRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
export const createContext = createTRPCContext;
