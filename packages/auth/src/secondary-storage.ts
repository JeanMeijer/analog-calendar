import { Redis } from "@upstash/redis";
import type { SecondaryStorage } from "better-auth";

import { env } from "@repo/env/server";

export function secondaryStorage(): SecondaryStorage | undefined {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    return undefined;
  }

  const client = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

  return {
    get: async (key) => {
      const value = (await client.get<string | null>(key)) ?? null;

      if (typeof value === "string") {
        return value;
      }

      return value ? JSON.stringify(value) : null;
    },
    set: async (key, value, ttl) => {
      if (ttl) {
        await client.set(key, value, { ex: ttl });
      } else {
        await client.set(key, value);
      }
    },
    delete: async (key) => {
      await client.del(key);
    },
  };
}
