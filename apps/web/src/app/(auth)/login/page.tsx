import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@repo/auth/server";

import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign In - Analog",
};

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex h-dvh w-dvw items-center justify-center">
      <SignInForm />
    </div>
  );
}
