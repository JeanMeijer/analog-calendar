import "server-only";
import { auth, type Session } from "@repo/auth/server";
import { db } from "@repo/db";

export const getActiveAccount = async (
  user: Session["user"],
  headers: Headers,
) => {
  if (user?.defaultAccountId) {
    const activeAccount = await db.query.account.findFirst({
      where: (table, { eq, and }) =>
        and(
          eq(table.userId, user.id),
          eq(table.id, user.defaultAccountId as string),
        ),
    });

    if (activeAccount) {
      const { accessToken } = await auth.api.getAccessToken({
        body: {
          providerId: activeAccount?.providerId,
          accountId: activeAccount?.id,
          userId: activeAccount?.userId,
        },
        headers,
      });

      return {
        ...activeAccount,
        accessToken: accessToken ?? activeAccount.accessToken,
      };
    }
  }

  const firstAccount = await db.query.account.findFirst({
    where: (table, { eq }) => eq(table.userId, user.id),
  });

  if (!firstAccount) {
    throw new Error("No account found");
  }

  const { accessToken } = await auth.api.getAccessToken({
    body: {
      providerId: firstAccount.providerId,
      accountId: firstAccount.id,
      userId: firstAccount.userId,
    },
    headers,
  });

  return {
    ...firstAccount,
    accessToken: accessToken ?? firstAccount.accessToken,
  };
};

export const getAccounts = async (user: Session["user"], headers: Headers) => {
  const _accounts = await db.query.account.findMany({
    where: (table, { eq }) => eq(table.userId, user.id),
  });

  const accounts = await Promise.all(
    _accounts.map(async (account) => {
      try {
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
      } catch {
        throw new Error(`Failed to get access token for account ${account.id}`);
      }
    }),
  );

  return accounts.filter(
    (account) => account.accessToken && account.refreshToken,
  );
};
