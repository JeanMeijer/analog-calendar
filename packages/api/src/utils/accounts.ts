import "server-only";

import { eq } from "drizzle-orm";

import { auth, type Account, type User } from "@repo/auth/server";
import { db } from "@repo/db";
import { user as userTable } from "@repo/db/schema";

async function withAccessToken(account: Account, headers: Headers) {
  const { accessToken } = await auth.api.getAccessToken({
    body: {
      providerId: account.providerId,
      accountId: account.id,
      userId: account.userId,
    },
    headers,
  });

  return {
    ...account,
    accessToken: accessToken ?? account.accessToken,
  };
}

export async function getDefaultAccount(user: User, headers: Headers) {
  const defaultAccountId = user.defaultAccountId;

  if (defaultAccountId) {
    const defaultAccount = await db.query.account.findFirst({
      where: (table, { eq, and }) =>
        and(eq(table.userId, user.id), eq(table.id, defaultAccountId)),
    });

    return await withAccessToken(defaultAccount!, headers);
  }

  const account = await db.transaction(async (tx) => {
    const account = await tx.query.account.findFirst({
      where: (table, { eq }) => eq(table.userId, user.id),
      orderBy: (table, { desc }) => desc(table.createdAt),
    });

    await tx
      .update(userTable)
      .set({
        defaultAccountId: account!.id,
      })
      .where(eq(userTable.id, user.id));

    return account!;
  });

  return await withAccessToken(account, headers);
}

export async function getAccounts(user: User, headers: Headers) {
  const accounts = await db.query.account.findMany({
    where: (table, { eq }) => eq(table.userId, user.id),
  });

  const promises = accounts.map(async (account) => {
    return withAccessToken(account, headers);
  });

  return Promise.all(promises);
}
