import "server-only";
import { cache, type ReactNode } from "react";
import { headers } from "next/headers";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import {
  TRPCQueryOptions,
  createTRPCOptionsProxy,
} from "@trpc/tanstack-react-query";

import { appRouter, createContext } from "@repo/api";

import { makeQueryClient } from "./query-client";

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);

const ctx = async () => createContext({ headers: await headers() });

export const trpc = createTRPCOptionsProxy({
  ctx,
  router: appRouter,
  queryClient: getQueryClient,
});

export const caller = appRouter.createCaller(ctx);

export function HydrateClient(props: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
