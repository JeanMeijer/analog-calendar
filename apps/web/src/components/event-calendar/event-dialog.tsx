"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RiCalendarLine, RiDeleteBinLine } from "@remixicon/react";
import { useMutation } from "@tanstack/react-query";
import { format, isBefore } from "date-fns";
import { toast } from "sonner";
import { Temporal } from "temporal-polyfill";

import { toDate } from "@repo/temporal";

import { useCalendarSettings } from "@/atoms";
import type { CalendarEvent } from "@/components/event-calendar";
import {
  DefaultEndHour,
  DefaultStartHour,
  EndHour,
  StartHour,
} from "@/components/event-calendar/constants";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAccounts, useDefaultAccount } from "@/hooks/accounts";
import { useTRPC } from "@/lib/trpc/client";
import { cn, getConferencingProviderId } from "@/lib/utils";

interface EventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

type MeetingProviderId = "none" | "google" | "zoom";

/**
 * Hook that exposes conferencing actions backed by tRPC.
 * It automatically selects the correct account for the chosen provider.
 */
function useConferencingActions() {
  const trpc = useTRPC();
  const { accounts } = useAccounts();

  const {
    mutateAsync: createConferenceMutation,
    isPending: creatingConference,
  } = useMutation(trpc.conferencing.create.mutationOptions());

  /**
   * Creates a conference for the given provider. It will throw if the user
   * does not have an account connected for that provider.
   */
  const createConference = useCallback(
    async (params: {
      providerId: MeetingProviderId;
      accountId: string;
      calendarAccountId?: string;
      agenda: string;
      startTime: string;
      endTime: string;
      timeZone?: string;
      calendarId?: string;
      eventId?: string;
    }) => {
      const account = accounts?.find((a) => a.id === params.accountId);

      if (!account) {
        throw new Error("Selected account not found or not linked");
      }

      if (
        params.providerId !== "none" &&
        account.providerId !== params.providerId
      ) {
        throw new Error("Account provider mismatch with selected provider");
      }

      const response = await createConferenceMutation(params);

      return response.conferenceData;
    },
    [accounts, createConferenceMutation],
  );

  return {
    createConference,
    creatingConference,
  } as const;
}

export function EventDialog({
  event,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: EventDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState(`${DefaultStartHour}:00`);
  const [endTime, setEndTime] = useState(`${DefaultEndHour}:00`);
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [meetingProviderId, setMeetingProviderId] =
    useState<MeetingProviderId>("none");
  const [conferenceLink, setConferenceLink] = useState<string | null>(null);

  const defaultAccount = useDefaultAccount();
  const settings = useCalendarSettings();
  const { accounts } = useAccounts();
  const { createConference, creatingConference } = useConferencingActions();

  const buildDateWithTime = (date: Date, time: string): string => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(h || 0, m || 0, 0, 0);
    return d.toISOString();
  };

  /**
   * Handle provider change from the UI. When a provider is selected we check
   * if the user has the required account connected. If not, we show a toast.
   * For providers that are connected, we try to create the conferencing resource
   * immediately. For Google Meet we need an existing calendar event (because it
   * attaches the conference to the event) so we only attempt creation if an
   * `event?.id` is present (i.e. editing an existing event).
   */
  const handleMeetingProviderChange = useCallback(
    async (provider: MeetingProviderId) => {
      setMeetingProviderId(provider);

      // Reset any previous link
      setConferenceLink(null);

      if (provider === "none") {
        // Handle removing conference data
        if (event?.id && event?.calendarId && event?.accountId) {
          try {
            const startISO = buildDateWithTime(startDate, startTime);
            const endISO = buildDateWithTime(endDate, endTime);

            await createConference({
              providerId: provider,
              accountId: event.accountId,
              calendarAccountId: event.accountId,
              agenda: title || "Meeting",
              startTime: startISO,
              endTime: endISO,
              timeZone: settings.defaultTimeZone,
              calendarId: event.calendarId,
              eventId: event.id,
            });
          } catch (error) {
            console.error("Failed to remove conference data:", error);
          }
        }
        return;
      }

      // Check if user has the required account connected
      const hasRequiredAccount = accounts?.some(
        (a) => a.providerId === provider,
      );

      if (!hasRequiredAccount) {
        toast.error(
          `Please connect a ${provider === "google" ? "Google" : "Zoom"} account to use ${provider === "google" ? "Google Meet" : "Zoom"}`,
        );
        // Reset back to "none" since they can't use this provider
        setMeetingProviderId("none");
        return;
      }

      // For Google Meet, we need an existing event
      if (provider === "google" && (!event?.id || !event?.calendarId)) {
        toast.info(
          "Google Meet link will be generated after the event is saved.",
        );
        return;
      }

      try {
        const buildDateWithTime = (date: Date, time: string): string => {
          const [h, m] = time.split(":").map(Number);
          const d = new Date(date);
          d.setHours(h || 0, m || 0, 0, 0);
          return d.toISOString();
        };

        const startISO = buildDateWithTime(startDate, startTime);
        const endISO = buildDateWithTime(endDate, endTime);

        // Find the appropriate account to use
        let accountId: string | undefined;

        if (event?.accountId) {
          const eventAccount = accounts?.find((a) => a.id === event.accountId);
          if (eventAccount?.providerId === provider) {
            accountId = event.accountId;
          }
        }

        if (
          !accountId &&
          defaultAccount &&
          defaultAccount.providerId === provider
        ) {
          accountId = defaultAccount.id;
        }

        if (!accountId) {
          accountId = accounts?.find((a) => a.providerId === provider)?.id;
        }

        if (!accountId) {
          toast.error(
            `No ${provider === "google" ? "Google" : "Zoom"} account found`,
          );
          setMeetingProviderId("none");
          return;
        }

        const conferenceData = await createConference({
          providerId: provider,
          accountId,
          calendarAccountId: event?.accountId,
          agenda: title || "Meeting",
          startTime: startISO,
          endTime: endISO,
          timeZone: settings.defaultTimeZone,
          calendarId: event?.calendarId,
          eventId: event?.id,
        });

        const link = conferenceData?.entryPoints?.[0]?.uri ?? null;
        setConferenceLink(link);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to create meeting",
        );
        setMeetingProviderId("none");
      }
    },
    [
      createConference,
      accounts,
      defaultAccount,
      endDate,
      endTime,
      event,
      settings.defaultTimeZone,
      startDate,
      startTime,
      title,
    ],
  );

  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setDescription(event.description || "");

      const start = toDate({
        value: event.start,
        timeZone: settings.defaultTimeZone,
      });
      const end = toDate({
        value: event.end,
        timeZone: settings.defaultTimeZone,
      });

      setStartDate(start);
      setEndDate(end);
      setStartTime(formatTimeForInput(start));
      setEndTime(formatTimeForInput(end));
      setAllDay(event.allDay || false);
      setLocation(event.location || "");

      // Initialize conference state from event data
      if (event.conferenceData?.entryPoints?.[0]?.uri) {
        setConferenceLink(event.conferenceData.entryPoints[0].uri);
        setMeetingProviderId(
          getConferencingProviderId(event.conferenceData.entryPoints[0].uri),
        );
      } else {
        setConferenceLink(null);
        setMeetingProviderId("none");
      }

      setError(null); // Reset error when opening dialog
    } else {
      resetForm();
    }
  }, [event, settings.defaultTimeZone]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate(new Date());
    setEndDate(new Date());
    setStartTime(`${DefaultStartHour}:00`);
    setEndTime(`${DefaultEndHour}:00`);
    setAllDay(false);
    setLocation("");
    setMeetingProviderId("none");
    setConferenceLink(null);
    setError(null);
  };

  const formatTimeForInput = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = Math.floor(date.getMinutes() / 15) * 15;
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  // Memoize time options so they're only calculated once
  const timeOptions = useMemo(() => {
    const options = [];
    for (let hour = StartHour; hour < EndHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const value = `${formattedHour}:${formattedMinute}`;
        // Use a fixed date to avoid unnecessary date object creations
        const date = new Date(2000, 0, 1, hour, minute);
        const label = format(date, "h:mm a");
        options.push({ value, label });
      }
    }
    return options;
  }, []); // Empty dependency array ensures this only runs once

  const handleSave = () => {
    if (event?.readOnly) {
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!allDay) {
      const [startHours = 0, startMinutes = 0] = startTime
        .split(":")
        .map(Number);
      const [endHours = 0, endMinutes = 0] = endTime.split(":").map(Number);

      if (
        startHours < StartHour ||
        startHours > EndHour ||
        endHours < StartHour ||
        endHours > EndHour
      ) {
        setError(
          `Selected time must be between ${StartHour}:00 and ${EndHour}:00`,
        );
        return;
      }

      start.setHours(startHours, startMinutes, 0);
      end.setHours(endHours, endMinutes, 0);
    } else {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    }

    // Validate that end date is not before start date
    if (isBefore(end, start)) {
      setError("End date cannot be before start date");
      return;
    }

    // Use generic title if empty
    const eventTitle = title.trim() ? title : undefined;

    if (!defaultAccount) {
      toast.error("No default account available, sign in again.");
      return;
    }

    onSave({
      id: event?.id || "",
      title: eventTitle || "",
      description,
      start: allDay
        ? Temporal.PlainDate.from(start.toISOString().split("T")[0]!)
        : Temporal.Instant.from(start.toISOString()).toZonedDateTimeISO(
            (event?.start as Temporal.ZonedDateTime).timeZoneId,
          ),
      end: allDay
        ? Temporal.PlainDate.from(end.toISOString().split("T")[0]!)
        : Temporal.Instant.from(end.toISOString()).toZonedDateTimeISO(
            (event?.end as Temporal.ZonedDateTime).timeZoneId,
          ),
      allDay,
      location,
      color: event?.color,
      calendarId: event?.calendarId ?? "primary",
      providerId: event?.providerId ?? defaultAccount.providerId,
      accountId: event?.accountId ?? defaultAccount.id,
      conferenceData: event?.conferenceData,
      readOnly: false,
    });
  };

  const handleDelete = () => {
    if (event?.id) {
      onDelete(event.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event?.id ? "Edit Event" : "Create Event"}</DialogTitle>
          <DialogDescription className="sr-only">
            {event?.id
              ? "Edit the details of this event"
              : "Add a new event to your calendar"}
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="grid gap-4 py-4">
          <div className="*:not-first:mt-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="*:not-first:mt-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 *:not-first:mt-1.5">
              <Label htmlFor="start-date">Start Date</Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant={"outline"}
                    className={cn(
                      "group w-full justify-between border-input bg-background px-3 font-normal outline-offset-0 outline-none hover:bg-background focus-visible:outline-[3px]",
                      !startDate && "text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "truncate",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </span>
                    <RiCalendarLine
                      size={16}
                      className="shrink-0 text-muted-foreground/80"
                      aria-hidden="true"
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    defaultMonth={startDate}
                    onSelect={(date) => {
                      if (date) {
                        setStartDate(date);
                        // If end date is before the new start date, update it to match the start date
                        if (isBefore(endDate, date)) {
                          setEndDate(date);
                        }
                        setError(null);
                        setStartDateOpen(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {!allDay && (
              <div className="min-w-28 *:not-first:mt-1.5">
                <Label htmlFor="start-time">Start Time</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger id="start-time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1 *:not-first:mt-1.5">
              <Label htmlFor="end-date">End Date</Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="end-date"
                    variant={"outline"}
                    className={cn(
                      "group w-full justify-between border-input bg-background px-3 font-normal outline-offset-0 outline-none hover:bg-background focus-visible:outline-[3px]",
                      !endDate && "text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "truncate",
                        !endDate && "text-muted-foreground",
                      )}
                    >
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </span>
                    <RiCalendarLine
                      size={16}
                      className="shrink-0 text-muted-foreground/80"
                      aria-hidden="true"
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    defaultMonth={endDate}
                    disabled={{ before: startDate }}
                    onSelect={(date) => {
                      if (date) {
                        setEndDate(date);
                        setError(null);
                        setEndDateOpen(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {!allDay && (
              <div className="min-w-28 *:not-first:mt-1.5">
                <Label htmlFor="end-time">End Time</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger id="end-time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="all-day"
              checked={allDay}
              onCheckedChange={(checked) => setAllDay(checked === true)}
            />
            <Label htmlFor="all-day">All day</Label>
          </div>

          <div className="*:not-first:mt-1.5">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="overflow-hidden *:not-first:mt-1.5">
            <Label htmlFor="conferencing">Conferencing</Label>
            <Select
              value={meetingProviderId}
              onValueChange={handleMeetingProviderChange}
              disabled={creatingConference}
            >
              <SelectTrigger id="conferencing">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {["none", "google", "zoom"].map((p) => (
                  <SelectItem key={p} value={p}>
                    {p === "none"
                      ? "None"
                      : p === "google"
                        ? "Google Meet"
                        : "Zoom"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {conferenceLink && (
              <p className="mt-1 truncate text-sm">
                <a
                  href={conferenceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  {conferenceLink}
                </a>
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="flex-row sm:justify-between">
          {event?.id && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
              aria-label="Delete event"
            >
              <RiDeleteBinLine size={16} aria-hidden="true" />
            </Button>
          )}
          <div className="flex flex-1 justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
