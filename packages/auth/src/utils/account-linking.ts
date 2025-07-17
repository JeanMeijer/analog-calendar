import {
  GenericEndpointContext,
  Account as HookAccountRecord,
} from "better-auth";
import { APIError } from "better-auth/api";
import { eq } from "drizzle-orm";

import { db } from "@repo/db";
import { account as accountTable, user } from "@repo/db/schema";

export const createProviderHandler = async (
  account: HookAccountRecord,
  ctx: GenericEndpointContext | undefined,
) => {
  if (!account.accessToken || !account.refreshToken) {
    throw new APIError("INTERNAL_SERVER_ERROR", {
      message: "Access token or refresh token is not set",
    });
  }

  const provider = ctx?.context.socialProviders.find(
    (p) => p.id === account.providerId,
  );

  if (!provider) {
    throw new APIError("INTERNAL_SERVER_ERROR", {
      message: `Provider account provider is ${account.providerId} but it is not configured`,
    });
  }

  const profile = await provider.getUserInfo({
    accessToken: account.accessToken,
    refreshToken: account.refreshToken,
    scopes: account.scope?.split(",") ?? [],
    idToken: account.idToken ?? undefined,
  });

  if (!profile?.user) {
    throw new APIError("INTERNAL_SERVER_ERROR", {
      message: "User info is not available",
    });
  }

  await db.transaction(async (tx) => {
    await tx
      .update(accountTable)
      .set({
        name: profile.user.name,
        email: profile.user.email ?? undefined,
        image: profile.user.image,
      })
      .where(eq(accountTable.id, account.id));

    if (user.defaultAccountId) {
      return;
    }

    // TODO: set default calendar
    await tx
      .update(user)
      .set({
        defaultAccountId: account.id,
      })
      .where(eq(user.id, account.userId));
  });
};
