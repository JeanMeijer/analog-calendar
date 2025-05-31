"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { authClient } from "@repo/auth/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { emailProviders } from "@/lib/constants";

interface AddAccountDialogProps {
  children: React.ReactNode;
}

export function AddAccountDialog({ children }: AddAccountDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState<string | null>(null);

  const handleLinkAccount = async (provider: string) => {
    try {
      setIsLoading(provider);
      await authClient.linkSocial({
        provider: provider as "google" | "microsoft",
        callbackURL: "/calendar",
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to link account:", error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Account</DialogTitle>
          <DialogDescription>
            Link an additional email account to your profile. Choose from the
            available providers below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {emailProviders.map((emailProvider) => (
            <Button
              key={emailProvider.provider}
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleLinkAccount(emailProvider.provider)}
              disabled={isLoading === emailProvider.provider}
            >
              <Plus className="mr-2 h-4 w-4" />
              {isLoading === emailProvider.provider
                ? "Connecting..."
                : `Add ${emailProvider.name}`}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
