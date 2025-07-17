"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

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
import { ProviderId, providers } from "@/lib/providers";

interface AddAccountDialogProps {
  children: React.ReactNode;
}

export function AddAccountDialog({ children }: AddAccountDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState<string | null>(null);

  const handleLinkAccount = async (provider: ProviderId) => {
    try {
      setIsLoading(provider);
      await authClient.linkSocial({
        provider: provider,
        callbackURL: "/calendar",
      });
      setOpen(false);
    } catch {
      toast.error("Failed to link account");
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
          {providers.map((provider) => (
            <Button
              key={provider.id}
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleLinkAccount(provider.id)}
              disabled={isLoading === provider.id}
            >
              <Plus className="mr-2 h-4 w-4" />
              {isLoading === provider.id
                ? "Connecting..."
                : `Add ${provider.name}`}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
