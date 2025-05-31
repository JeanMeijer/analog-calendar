"use client";

import { useState } from "react";
import Link from "next/link";

import { authClient } from "@repo/auth/client";

import { Google, Microsoft } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SignInFormProps {
  redirectUrl?: string;
}

const providers = [
  {
    id: "google" as const,
    name: "Google",
    Icon: Google,
  },
  {
    id: "microsoft" as const,
    name: "Microsoft",
    Icon: Microsoft,
  },
] as const;

export function SignInForm({ redirectUrl = "/calendar" }: SignInFormProps) {
  const [loading, setLoading] = useState(false);

  const signInWithProvider = async (
    providerId: (typeof providers)[number]["id"],
  ) => {
    await authClient.signIn.social(
      {
        provider: providerId,
        callbackURL: redirectUrl,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onResponse: () => {
          setLoading(false);
        },
      },
    );
  };

  return (
    <Card className="max-w-md border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-center text-xl md:text-2xl">
          Analog
        </CardTitle>
        <CardDescription className="text-md text-center text-balance md:text-lg">
          The calendar that changes everything
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8">
          <div
            className={cn(
              "flex w-full items-center gap-2",
              "flex-col justify-between",
            )}
          >
            {providers.map((provider) => {
              return (
                <Button
                  key={provider.id}
                  variant="outline"
                  className={cn("w-full gap-2")}
                  disabled={loading}
                  onClick={() => signInWithProvider(provider.id)}
                >
                  <provider.Icon />
                  Continue with {provider.name}
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-center py-4">
          <p className="text-center text-sm text-balance text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="font-medium text-primary hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium text-primary hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
