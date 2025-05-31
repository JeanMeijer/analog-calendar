"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import {
  DraggableEvent,
  DroppableCell,
  EventGap,
  EventHeight,
  EventItem,
  type CalendarEvent,
} from "@/components/event-calendar";
import { DefaultStartHour } from "@/components/event-calendar/constants";
import {
  useEventCollection,
  useEventVisibility,
  useGridLayout,
  useViewPreferences,
  type EventCollectionForMonth,
} from "@/components/event-calendar/hooks";
import {
  getDayKey,
  getEventSpanInfoForDay,
  getWeekDays,
  isWeekend,
  isWeekendIndex,
  sortEventsForDisplay,
} from "@/components/event-calendar/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, groupArrayIntoChunks } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface MonthViewContextType {
  currentDate: Date;
  days: Date[];
  weeks: Date[][];
  gridTemplateColumns: string;
  eventCollection: EventCollectionForMonth;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
  onEventCreate: (startTime: Date) => void;
}

const MonthViewContext = createContext<MonthViewContextType | null>(null);

function useMonthViewContext() {
  const context = useContext(MonthViewContext);
  if (!context) {
    throw new Error(
      "useMonthViewContext must be used within MonthViewProvider",
    );
  }
  return context;
}

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
  onEventCreate: (startTime: Date) => void;
}

export function MonthView({
  currentDate,
  events,
  onEventSelect,
  onEventCreate,
}: MonthViewProps) {
  const { days, weeks } = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const allDays = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });

    const weeksResult = groupArrayIntoChunks(allDays, 7);

    return { days: allDays, weeks: weeksResult };
  }, [currentDate]);

  const handleEventClick = useCallback(
    (event: CalendarEvent, e: React.MouseEvent) => {
      e.stopPropagation();
      onEventSelect(event);
    },
    [onEventSelect],
  );

  const gridTemplateColumns = useGridLayout(getWeekDays(new Date()));
  const eventCollection = useEventCollection(events, days, "month");

  const contextValue: MonthViewContextType = {
    currentDate,
    days,
    weeks,
    gridTemplateColumns,
    eventCollection,
    onEventClick: handleEventClick,
    onEventCreate,
  };

  return (
    <MonthViewContext.Provider value={contextValue}>
      <div data-slot="month-view" className="contents">
        <MonthViewHeader />
        <MonthViewWeeks />
      </div>
    </MonthViewContext.Provider>
  );
}

function MonthViewHeader() {
  const { gridTemplateColumns } = useMonthViewContext();
  const viewPreferences = useViewPreferences();

  return (
    <div
      className="grid border-b border-border/70 transition-[grid-template-columns] duration-200 ease-linear"
      style={{ gridTemplateColumns }}
    >
      {WEEKDAYS.map((day, index) => {
        const isDayVisible =
          viewPreferences.showWeekends || !isWeekendIndex(index);

        return (
          <div
            key={day}
            className={cn(
              "overflow-hidden py-2 text-center text-sm text-muted-foreground/70",
              !isDayVisible && "w-0",
            )}
            style={{ visibility: isDayVisible ? "visible" : "hidden" }}
          >
            {day}
          </div>
        );
      })}
    </div>
  );
}

function MonthViewWeeks() {
  const { weeks, gridTemplateColumns } = useMonthViewContext();

  return (
    <div className="grid h-[calc(100%-37px)] flex-1 auto-rows-fr">
      {weeks.map((week, weekIndex) => (
        <div
          key={`week-${weekIndex}`}
          className="grid transition-[grid-template-columns] duration-200 ease-linear [&:last-child>*]:border-b-0"
          style={{ gridTemplateColumns }}
        >
          {week.map((day, dayIndex) => (
            <MonthViewDay
              key={day.toString()}
              day={day}
              weekIndex={weekIndex}
              dayIndex={dayIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function MonthViewDay({
  day,
  weekIndex,
  dayIndex,
}: {
  day: Date;
  weekIndex: number;
  dayIndex: number;
}) {
  const { currentDate, onEventCreate } = useMonthViewContext();
  const viewPreferences = useViewPreferences();

  const handleDayClick = useCallback(() => {
    const startTime = new Date(day);
    startTime.setHours(DefaultStartHour, 0, 0);
    onEventCreate(startTime);
  }, [day, onEventCreate]);

  if (!day) return null;

  const isCurrentMonth = isSameMonth(day, currentDate);
  const isDayVisible = viewPreferences.showWeekends || !isWeekend(day);
  const isReferenceCell = weekIndex === 0 && dayIndex === 0;
  const cellId = `month-cell-${day.toISOString()}`;

  return (
    <div
      className={cn(
        "group overflow-hidden border-r border-b border-border/70 last:border-r-0 data-outside-cell:bg-muted/25 data-outside-cell:text-muted-foreground/70",
        !isDayVisible && "w-0",
      )}
      data-today={isToday(day) || undefined}
      data-outside-cell={!isCurrentMonth || undefined}
      style={{ visibility: isDayVisible ? "visible" : "hidden" }}
    >
      <DroppableCell id={cellId} date={day} onClick={handleDayClick}>
        <div className="mt-1 inline-flex size-6 items-center justify-center rounded-full text-sm group-data-today:bg-primary group-data-today:text-primary-foreground">
          {format(day, "d")}
        </div>
        <MonthViewDayEvents day={day} isReferenceCell={isReferenceCell} />
      </DroppableCell>
    </div>
  );
}

function MonthViewDayEvents({
  day,
  isReferenceCell,
}: {
  day: Date;
  isReferenceCell: boolean;
}) {
  const { eventCollection } = useMonthViewContext();
  const { contentRef, getVisibleEventCount } = useEventVisibility({
    eventHeight: EventHeight,
    eventGap: EventGap,
  });

  const { allDayEvents, allEvents } = useMemo(() => {
    const dayKey = getDayKey(day);
    return (
      eventCollection.eventsByDay.get(dayKey) ?? {
        allDayEvents: [],
        allEvents: [],
      }
    );
  }, [eventCollection, day]);

  const visibleCount = getVisibleEventCount(allDayEvents.length);
  const hasMore =
    visibleCount !== undefined && allDayEvents.length > visibleCount;
  const remainingCount = hasMore ? allDayEvents.length - visibleCount : 0;

  return (
    <div
      ref={isReferenceCell ? contentRef : null}
      className="min-h-[calc((var(--event-height)+var(--event-gap))*2)] sm:min-h-[calc((var(--event-height)+var(--event-gap))*3)] lg:min-h-[calc((var(--event-height)+var(--event-gap))*4)]"
    >
      {sortEventsForDisplay(allDayEvents).map((event, index) => {
        const isHidden = Boolean(visibleCount && index >= visibleCount);

        if (!visibleCount) return null;

        return (
          <MonthViewEvent
            key={event.id}
            event={event}
            day={day}
            isHidden={isHidden}
          />
        );
      })}

      {hasMore && (
        <MonthViewMoreEventsPopover
          day={day}
          remainingCount={remainingCount}
          allEvents={allEvents}
        />
      )}
    </div>
  );
}

function MonthViewEvent({
  event,
  day,
  isHidden,
}: {
  event: CalendarEvent;
  day: Date;
  isHidden: boolean;
}) {
  const { onEventClick } = useMonthViewContext();
  const { isFirstDay, isLastDay } = useMemo(
    () => getEventSpanInfoForDay(event, day),
    [event, day],
  );

  if (!isFirstDay) {
    return (
      <div
        className="aria-hidden:hidden"
        aria-hidden={isHidden ? "true" : undefined}
      >
        <EventItem
          onClick={(e) => onEventClick(event, e)}
          event={event}
          view="month"
          isFirstDay={isFirstDay}
          isLastDay={isLastDay}
        >
          <div className="invisible" aria-hidden={true}>
            {!event.allDay && (
              <span>{format(new Date(event.start.dateTime), "h:mm")} </span>
            )}
            {event.title}
          </div>
        </EventItem>
      </div>
    );
  }

  return (
    <div
      className="aria-hidden:hidden"
      aria-hidden={isHidden ? "true" : undefined}
    >
      <DraggableEvent
        event={event}
        view="month"
        onClick={(e) => onEventClick(event, e)}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
      />
    </div>
  );
}

function MonthViewMoreEventsPopover({
  day,
  remainingCount,
  allEvents,
}: {
  day: Date;
  remainingCount: number;
  allEvents: CalendarEvent[];
}) {
  const { onEventClick } = useMonthViewContext();

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <button
          className="mt-[var(--event-gap)] flex h-[var(--event-height)] w-full items-center overflow-hidden px-1 text-left text-[10px] text-muted-foreground backdrop-blur-md transition outline-none select-none hover:bg-muted/50 hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:px-2 sm:text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <span>
            + {remainingCount} <span className="max-sm:sr-only">more</span>
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className="max-w-52 p-3"
        style={
          {
            "--event-height": `${EventHeight}px`,
          } as React.CSSProperties
        }
      >
        <div className="space-y-2">
          <div className="text-sm font-medium">{format(day, "EEE d")}</div>
          <div className="space-y-1">
            {sortEventsForDisplay(allEvents).map((event) => {
              const { isFirstDay, isLastDay } = getEventSpanInfoForDay(
                event,
                day,
              );

              return (
                <EventItem
                  key={event.id}
                  onClick={(e) => onEventClick(event, e)}
                  event={event}
                  view="month"
                  isFirstDay={isFirstDay}
                  isLastDay={isLastDay}
                />
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
