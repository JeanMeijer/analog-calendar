import { Fragment, useCallback, useMemo, useRef, useState } from "react";
import { useResizeObserver } from "@react-hookz/web";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { useCalendarsVisibility } from "@/components/event-calendar/hooks";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/lib/trpc/client";

export type CalendarItem = {
  id: string;
  provider: string;
  name: string;
  primary: boolean | undefined;
};

function useCalendarList() {
  const trpc = useTRPC();

  return useQuery(trpc.calendars.list.queryOptions());
}

export function Calendars() {
  const { data, isLoading } = useCalendarList();

  if (isLoading) {
    return <CalendarsSkeleton />;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="relative flex scrollbar-hidden flex-1 flex-col gap-2 overflow-auto">
      {data.accounts.map((account, index) => (
        <Fragment key={account.name}>
          <SidebarGroup key={account.name} className="py-0">
            <Collapsible
              defaultOpen={index === 0}
              className="group/collapsible"
            >
              <CalendarName name={account.name} />
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {account.calendars.map((item: CalendarItem) => (
                      <ItemWithToggle key={item.id} item={item} />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
          <SidebarSeparator className="mx-0" />
        </Fragment>
      ))}
    </div>
  );
}

function CalendarsSkeleton() {
  const accountsData = [{ calendars: 3 }, { calendars: 2 }];

  return (
    <div className="flex flex-col gap-2 pb-2">
      {accountsData.map((account, accountIndex) => (
        <div key={accountIndex}>
          <div className="flex items-center gap-2 px-2 py-2">
            <Skeleton className="animate-shimmer h-4 w-24 bg-neutral-500/20" />
            <div className="ml-auto">
              <Skeleton className="h-4 w-4 bg-neutral-500/20" />
            </div>
          </div>
          <div className="space-y-1 pl-0.5">
            {Array.from({ length: account.calendars }).map(
              (_, calendarIndex) => (
                <div
                  key={calendarIndex}
                  className="flex items-center gap-2 px-2 py-2"
                >
                  <Skeleton className="h-4 w-4 rounded bg-neutral-500/20" />
                  <Skeleton className="animate-shimmer h-4 flex-1 bg-neutral-500/20" />
                </div>
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function CalendarName({ name }: { name: string }) {
  const nameParts = useMemo(() => {
    if (name.includes("@")) {
      const parts = name.split("@");
      return [parts[0], `@${parts[1]}`];
    }
    return [name, ""];
  }, [name]);

  return (
    <SidebarGroupLabel
      asChild
      className="group/label w-full text-sm hover:bg-sidebar-accent"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between">
        <span className="truncate">{nameParts[0]}</span>
        <span className="mr-1 block flex-1 text-left">{nameParts[1]}</span>
        <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
      </CollapsibleTrigger>
    </SidebarGroupLabel>
  );
}

function ItemWithToggle({ item }: { item: CalendarItem }) {
  const [calendarsVisibility, setCalendarsVisibility] =
    useCalendarsVisibility();
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTextTruncated, setIsTextTruncated] = useState(false);

  // Check for text truncation whenever the element resizes
  useResizeObserver(textRef, () => {
    const element = textRef.current;
    if (element) {
      setIsTextTruncated(element.scrollWidth > element.clientWidth);
    }
  });

  const handleCalendarVisibilityChange = useCallback(
    (checked: boolean, calendarId: string) => {
      const newHiddenCalendars = checked
        ? calendarsVisibility.hiddenCalendars.filter((id) => id !== calendarId)
        : [...calendarsVisibility.hiddenCalendars, calendarId];

      setCalendarsVisibility({
        hiddenCalendars: newHiddenCalendars,
      });
    },
    [calendarsVisibility.hiddenCalendars, setCalendarsVisibility],
  );

  const tooltipProps = {
    side: "bottom" as const,
    align: "start" as const,
    sideOffset: 8,
    className: "bg-sidebar-accent text-sidebar-accent-foreground",
    children: item.name,
  };

  return (
    <SidebarMenuItem key={item.id} className="group/item">
      <SidebarMenuButton
        asChild
        tooltip={isTextTruncated ? tooltipProps : undefined}
        className="hover:bg-neutral-600/20"
      >
        <div className="relative">
          <Checkbox
            className="dark:border-neutral-700"
            checked={!calendarsVisibility.hiddenCalendars.includes(item.id)}
            onCheckedChange={(checked: boolean) => {
              handleCalendarVisibilityChange(checked, item.id);
            }}
          />
          <span ref={textRef} className="line-clamp-1 block">
            {item.name}
          </span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
