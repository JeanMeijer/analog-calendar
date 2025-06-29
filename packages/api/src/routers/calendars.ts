import { calendarProcedure, createTRPCRouter } from "../trpc";

export const calendarsRouter = createTRPCRouter({
  list: calendarProcedure.query(async ({ ctx }) => {
    const promises = ctx.providers.map(async ({ client, account }) => {
      const calendars = await client.calendars();

      return {
        id: account.id,
        providerId: account.providerId,
        name: account.email,
        calendars,
      };
    });

    const accounts = await Promise.all(promises);

    return {
      accounts,
    };
  }),
});
