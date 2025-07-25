"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";

import { authClient } from "@repo/auth/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ReauthDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const [providerId, setProviderId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const unsubscribeQuery = queryClient.getQueryCache().subscribe((event) => {
      const error = (event as any).query?.state?.error;
      if (
        error instanceof TRPCClientError &&
        typeof error.message === "string" &&
        error.message.startsWith("REAUTH:")
      ) {
        setProviderId(error.message.split(":")[1] ?? null);
      }
    });

    const unsubscribeMutation = queryClient
      .getMutationCache()
      .subscribe((event) => {
        const error = (event as any).state?.error;
        if (
          error instanceof TRPCClientError &&
          typeof error.message === "string" &&
          error.message.startsWith("REAUTH:")
        ) {
          setProviderId(error.message.split(":")[1] ?? null);
        }
      });

    return () => {
      unsubscribeQuery();
      unsubscribeMutation();
    };
  }, [queryClient]);

  const close = () => setProviderId(null);

  const handleReauth = async () => {
    if (!providerId) return;
    await authClient.linkSocial({
      provider: providerId as "google" | "microsoft",
      callbackURL: window.location.href,
    });
  };

  return (
    <>
      {children}
      <Dialog
        open={providerId !== null}
        onOpenChange={(open) => !open && close()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reconnect Account</DialogTitle>
            <DialogDescription>
              Please reauthenticate your {providerId ?? ""} account to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={handleReauth}>Reconnect</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
