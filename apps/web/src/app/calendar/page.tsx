import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@repo/auth/server";

import { CalendarLayout } from "@/components/calendar-layout";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return <CalendarLayout />;
}
