import { useId, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Plus } from "lucide-react";
import { toast } from "sonner";

import { Calendar } from "@repo/api/providers/interfaces";

import { AddAccountDialog } from "@/components/add-account-dialog";
import { Google, Microsoft } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/lib/trpc/client";

type Account = {
  id: string;
  accountId: string;
  providerId: "google" | "microsoft";
  name: string;
  email: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function useAccounts() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: accountsData, isLoading: isLoadingAccounts } = useQuery(
    trpc.accounts.list.queryOptions(),
  );

  const { mutate: disconnect, isPending: isDisconnecting } = useMutation(
    trpc.accounts.disconnect.mutationOptions({
      onSuccess: () => {
        toast.success("Account disconnected");
        queryClient.invalidateQueries({
          queryKey: [["accounts"], { type: "query" }],
        });
        queryClient.invalidateQueries({
          queryKey: [["calendars"], { type: "query" }],
        });
      },
      onError: (error) => {
        toast.error(`Failed to disconnect account: ${error.message}`);
      },
    }),
  );

  return {
    accounts: accountsData?.accounts ?? [],
    isLoadingAccounts,
    disconnect,
    isDisconnecting,
  };
}

function useCalendars() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: calendarsData, isLoading: isLoadingCalendars } = useQuery(
    trpc.calendars.list.queryOptions(),
  );
  const { data: defaultCalendarId, isLoading: isLoadingDefaultCalendar } =
    useQuery(trpc.calendars.getDefaultId.queryOptions());

  const { mutate: setDefaultCalendar, isPending: isSettingDefaultCalendar } =
    useMutation(
      trpc.calendars.setDefaultId.mutationOptions({
        onSuccess: () => {
          toast.success("Default calendar updated");
          queryClient.invalidateQueries({
            queryKey: [["calendars"], { type: "query" }],
          });
          queryClient.invalidateQueries({
            queryKey: [["accounts"], { type: "query" }],
          });
        },
        onError: (error) => {
          toast.error(`Failed to update default calendar: ${error.message}`);
        },
      }),
    );

  return {
    calendarsData,
    defaultCalendarId,
    isLoadingCalendars,
    isLoadingDefaultCalendar,
    setDefaultCalendar,
    isSettingDefaultCalendar,
  };
}

export function Accounts() {
  const { accounts, isLoadingAccounts, disconnect, isDisconnecting } =
    useAccounts();

  const {
    calendarsData,
    defaultCalendarId,
    isLoadingCalendars,
    isLoadingDefaultCalendar,
    setDefaultCalendar,
    isSettingDefaultCalendar,
  } = useCalendars();

  const disconnectAccount = (accountId: string) => {
    const account = accounts.find((acc) => acc.accountId === accountId);
    if (!account) return;

    disconnect({
      id: accountId,
      providerId: account.providerId,
    });
  };

  const handleSetDefaultCalendar = (calendarId: string) => {
    let accountId: string | null = null;

    if (calendarsData?.accounts) {
      for (const account of calendarsData.accounts) {
        const calendarExists = account.calendars.some(
          (calendar) => calendar.id === calendarId,
        );
        if (calendarExists) {
          accountId = account.id;
          break;
        }
      }
    }

    if (!accountId) {
      toast.error("Unable to find account for this calendar");
      return;
    }

    setDefaultCalendar({ calendarId, accountId });
  };

  return (
    <div className="flex flex-col gap-6 px-3">
      <section className="space-y-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-md font-light">Default Calendar</h2>
          <p className="text-sm text-muted-foreground">
            Events will be created in this calendar by default
          </p>
        </div>

        {isLoadingCalendars || isLoadingDefaultCalendar ? (
          <DefaultCalendarSkeleton />
        ) : calendarsData?.accounts && calendarsData.accounts.length > 0 ? (
          <DefaultCalendarSelect
            accountsWithCalendars={calendarsData.accounts}
            value={defaultCalendarId?.defaultCalendarId || ""}
            onChange={handleSetDefaultCalendar}
            isLoading={isSettingDefaultCalendar}
          />
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            <p>No calendars available.</p>
            <p className="mt-1 text-sm">Add an account to get started.</p>
          </div>
        )}
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-md font-light">Connected Accounts</h2>
            <p className="text-sm text-muted-foreground">
              Accounts that Analog can read and write to
            </p>
          </div>
          <AddAccountButton />
        </div>

        {isLoadingAccounts ? (
          <AccountsListSkeleton />
        ) : accounts.length > 0 ? (
          <AccountsList
            accounts={accounts}
            onDisconnect={disconnectAccount}
            isDeleting={isDisconnecting}
          />
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>No accounts connected yet.</p>
            <p className="mt-1 text-sm">Add an account to get started.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function AccountIcon({ provider }: { provider: "google" | "microsoft" }) {
  switch (provider) {
    case "google":
      return <Google className="size-4" />;
    case "microsoft":
      return <Microsoft className="size-4" />;
    default:
      return null;
  }
}

function AccountRow({
  account,
  onDisconnect,
  isDeleting,
}: {
  account: Account;
  onDisconnect: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/80 px-3 py-2 hover:bg-muted-foreground/5">
      <AccountIcon provider={account.providerId} />

      <span className="flex-1 text-sm">{account.email}</span>

      {isDeleting ? (
        <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDisconnect}
          className="h-6 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          Disconnect
        </Button>
      )}
    </div>
  );
}

function DefaultCalendarSelect({
  accountsWithCalendars,
  value,
  onChange,
  isLoading,
}: {
  accountsWithCalendars: Array<{
    id: string;
    providerId: "google" | "microsoft";
    name: string;
    calendars: Calendar[];
  }>;
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}) {
  const id = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="sr-only">
        Default Calendar
      </Label>
      <Select value={value} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Select default calendar" />
        </SelectTrigger>
        <SelectContent>
          {accountsWithCalendars.map((account) => (
            <SelectGroup key={account.id}>
              <SelectLabel className="py-1.5 text-xs">
                {account.name}
              </SelectLabel>
              {account.calendars.map((calendar) => (
                <SelectItem
                  key={calendar.id}
                  value={calendar.id}
                  className="py-1.5 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-[4px]"
                      style={{ backgroundColor: calendar.color || "#3B82F6" }}
                    />
                    <span>{calendar.name}</span>
                    {calendar.primary && (
                      <span className="text-xs text-muted-foreground">
                        (Primary)
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function AccountsList({
  accounts,
  onDisconnect,
  isDeleting,
}: {
  accounts: Account[];
  onDisconnect: (accountId: string) => void;
  isDeleting: boolean;
}) {
  return (
    <div className="space-y-3">
      {accounts.map((account) => (
        <AccountRow
          key={account.id}
          account={account}
          onDisconnect={() => onDisconnect(account.accountId)}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
}

function AddAccountButton() {
  return (
    <AddAccountDialog>
      <Button
        variant="outline"
        className="bg-transparent pr-4 hover:bg-muted-foreground/5"
        size="sm"
      >
        <Plus className="size-4" />
        Add Account
      </Button>
    </AddAccountDialog>
  );
}

function DefaultCalendarSkeleton() {
  return (
    <div className="w-fit">
      <Skeleton className="h-10 w-64" />
    </div>
  );
}

function AccountsListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 2 }).map((_, index) => (
        <AccountRowSkeleton key={index} />
      ))}
    </div>
  );
}

function AccountRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/80 px-3 py-2">
      {/* Provider icon skeleton */}
      <Skeleton className="size-4" />

      {/* Email skeleton */}
      <Skeleton className="h-4 flex-1" />

      {/* Action button skeleton */}
      <Skeleton className="h-6 w-20" />
    </div>
  );
}
