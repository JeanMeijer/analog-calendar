import { TRPCError } from "@trpc/server";
import { auth } from "@repo/auth/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { GoogleCalendarProvider } from "../providers/google-calendar";

export const calendarsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const { accessToken } = await auth.api.getAccessToken({
      body: {
        providerId: "google",
      },
      headers: ctx.headers,
    });

    if (!accessToken) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const client = new GoogleCalendarProvider({
      accessToken,
    });

    const calendars = await client.calendars();

    return {
      accounts: [
        {
          id: "1",
          provider: "google",
          name: ctx.user.email,
          calendars,
        },
      ],
    };
  }),
});
