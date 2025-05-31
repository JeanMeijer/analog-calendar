import { calendarProcedure, createTRPCRouter } from "../trpc";

export const calendarsRouter = createTRPCRouter({
  list: calendarProcedure.query(async ({ ctx }) => {
    const accounts = await Promise.all(
      ctx.allCalendarClients.map(async ({ client, connection }) => {
        const calendars = await client.calendars();

        return {
          id: connection.id,
          provider: connection.providerId,
          name: connection.email,
          calendars,
        };
      }),
    );

    return {
      accounts,
    };
  }),
});
