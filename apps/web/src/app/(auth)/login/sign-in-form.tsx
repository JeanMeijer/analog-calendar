"use client";

import { useState } from "react";
import Link from "next/link";

import { authClient } from "@repo/auth/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { providers, type ProviderId } from "@/lib/providers";
import { cn } from "@/lib/utils";

interface SignInFormProps {
  redirectUrl?: string;
}

export function SignInForm({ redirectUrl = "/calendar" }: SignInFormProps) {
  const [loading, setLoading] = useState(false);

  const signInWithProvider = async (id: ProviderId) => {
    await authClient.signIn.social(
      {
        provider: id,
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
    <Card className="max-w-sm border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-center text-xl font-medium md:text-2xl">
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
              "flex w-full flex-col items-center justify-between gap-4",
            )}
          >
            {providers.slice(0, 1).map((provider) => {
              return (
                <Button
                  key={provider.id}
                  variant="outline"
                  className={cn("w-full gap-2")}
                  disabled={loading}
                  onClick={() => signInWithProvider(provider.id)}
                >
                  <provider.icon />
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
