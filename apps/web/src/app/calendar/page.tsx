import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@repo/auth/server";

import { CalendarView } from "@/components/calendar-view";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-[calc(100dvh-1rem)]">
      <CalendarView className="grow" />
    </div>
  );
}
