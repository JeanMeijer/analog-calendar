"use client";

import React, { createContext, useContext, useMemo } from "react";
import {
  addHours,
  eachHourOfInterval,
  format,
  getHours,
  isBefore,
  isSameDay,
  isToday,
  startOfDay,
  startOfWeek,
} from "date-fns";

import {
  DraggableEvent,
  DroppableCell,
  EventItem,
  type CalendarEvent,
} from "@/components/event-calendar";
import { EndHour, StartHour } from "@/components/event-calendar/constants";
import {
  useCurrentTimeIndicator,
  useEventCollection,
  useGridLayout,
  useViewPreferences,
  type EventCollectionForWeek,
} from "@/components/event-calendar/hooks";
import {
  filterDaysByWeekendPreference,
  getWeekDays,
  isWeekend,
  type PositionedEvent,
} from "@/components/event-calendar/utils";
import { cn } from "@/lib/utils";

interface WeekViewContextType {
  allDays: Date[];
  visibleDays: Date[];
  hours: Date[];
  eventCollection: EventCollectionForWeek;
  currentDate: Date;
  gridTemplateColumns: string;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
  onEventCreate: (startTime: Date) => void;
}

const WeekViewContext = createContext<WeekViewContextType | null>(null);

function useWeekViewContext() {
  const context = useContext(WeekViewContext);
  if (!context) {
    throw new Error("useWeekViewContext must be used within WeekViewProvider");
  }
  return context;
}

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
  onEventCreate: (startTime: Date) => void;
}

export function WeekView({
  currentDate,
  events,
  onEventSelect,
  onEventCreate,
}: WeekViewProps) {
  const viewPreferences = useViewPreferences();

  const allDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const visibleDays = useMemo(
    () => filterDaysByWeekendPreference(allDays, viewPreferences.showWeekends),
    [allDays, viewPreferences.showWeekends],
  );

  const hours = useMemo(() => {
    const dayStart = startOfDay(currentDate);
    return eachHourOfInterval({
      start: addHours(dayStart, StartHour),
      end: addHours(dayStart, EndHour - 1),
    });
  }, [currentDate]);

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventSelect(event);
  };

  const gridTemplateColumns = useGridLayout(allDays, {
    includeTimeColumn: true,
  });
  const eventCollection = useEventCollection(events, visibleDays, "week");

  const contextValue: WeekViewContextType = {
    allDays,
    visibleDays,
    hours,
    eventCollection,
    currentDate,
    gridTemplateColumns,
    onEventClick: handleEventClick,
    onEventCreate,
  };

  return (
    <WeekViewContext.Provider value={contextValue}>
      <div data-slot="week-view" className="isolate flex flex-col">
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md">
          <WeekViewHeader />
          <WeekViewAllDaySection />
        </div>

        <div
          className="grid flex-1 overflow-hidden transition-[grid-template-columns] duration-200 ease-linear"
          style={{ gridTemplateColumns }}
        >
          <WeekViewTimeColumn />
          <WeekViewDayColumns />
        </div>
      </div>
    </WeekViewContext.Provider>
  );
}

function WeekViewHeader() {
  const { allDays, gridTemplateColumns } = useWeekViewContext();
  const viewPreferences = useViewPreferences();

  return (
    <div
      className="grid border-b border-border/70 transition-[grid-template-columns] duration-200 ease-linear"
      style={{ gridTemplateColumns }}
    >
      <div className="py-2 text-center text-sm text-muted-foreground/70">
        <span className="max-[479px]:sr-only">{format(new Date(), "O")}</span>
      </div>
      {allDays.map((day) => {
        const isDayVisible = viewPreferences.showWeekends || !isWeekend(day);

        return (
          <div
            key={day.toString()}
            className={cn(
              "overflow-hidden py-2 text-center text-sm text-muted-foreground/70 data-today:font-medium data-today:text-foreground",
              !isDayVisible && "w-0",
            )}
            data-today={isToday(day) || undefined}
            style={{ visibility: isDayVisible ? "visible" : "hidden" }}
          >
            <span className="truncate sm:hidden" aria-hidden="true">
              {format(day, "E")[0]} {format(day, "d")}
            </span>
            <span className="truncate max-sm:hidden">
              {format(day, "EEE dd")}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function WeekViewAllDaySection() {
  const {
    allDays,
    eventCollection,
    gridTemplateColumns,
    onEventClick,
    currentDate,
  } = useWeekViewContext();
  const viewPreferences = useViewPreferences();

  const weekStart = useMemo(
    () => startOfWeek(currentDate, { weekStartsOn: 0 }),
    [currentDate],
  );
  const allDayEvents =
    eventCollection.type === "week" ? eventCollection.allDayEvents : [];

  if (allDayEvents.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-border/70">
      <div
        className="grid transition-[grid-template-columns] duration-200 ease-linear"
        style={{ gridTemplateColumns }}
      >
        <div className="relative flex flex-col justify-center border-r border-border/70">
          <span className="w-16 max-w-full ps-2 text-right text-[10px] text-muted-foreground/70 sm:ps-4 sm:text-xs">
            All day
          </span>
        </div>
        {allDays.map((day, dayIndex) => {
          const isDayVisible = viewPreferences.showWeekends || !isWeekend(day);
          const dayAllDayEvents = allDayEvents.filter((event) => {
            const eventStart = new Date(event.start.dateTime);
            const eventEnd = new Date(event.end.dateTime);
            return (
              isSameDay(day, eventStart) ||
              (day > eventStart && day < eventEnd) ||
              isSameDay(day, eventEnd)
            );
          });

          return (
            <div
              key={day.toString()}
              className={cn(
                "relative overflow-hidden border-r border-border/70 last:border-r-0",
                isDayVisible ? "p-1" : "w-0",
              )}
              data-today={isToday(day) || undefined}
              style={{ visibility: isDayVisible ? "visible" : "hidden" }}
            >
              {dayAllDayEvents.map((event) => {
                const eventStart = new Date(event.start.dateTime);
                const eventEnd = new Date(event.end.dateTime);
                const isFirstDay = isSameDay(day, eventStart);
                const isLastDay = isSameDay(day, eventEnd);
                const isFirstVisibleDay =
                  dayIndex === 0 && isBefore(eventStart, weekStart);
                const shouldShowTitle = isFirstDay || isFirstVisibleDay;
                const isSingleDay = isSameDay(eventStart, eventEnd);

                return (
                  <div
                    className="relative z-10 w-full min-w-0"
                    key={`spanning-${event.id}`}
                  >
                    <EventItem
                      className={!isSingleDay && !isFirstDay ? "opacity-0" : ""}
                      onClick={(e) => onEventClick(event, e)}
                      event={event}
                      view="month"
                      isFirstDay={isFirstDay}
                      isLastDay={!isSingleDay || isLastDay}
                    >
                      <div
                        className={cn(
                          "truncate",
                          !shouldShowTitle && "invisible",
                        )}
                        aria-hidden={!shouldShowTitle}
                      >
                        {event.title}
                      </div>
                    </EventItem>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekViewTimeColumn() {
  const { hours } = useWeekViewContext();

  return (
    <div className="grid auto-cols-fr border-r border-border/70">
      {hours.map((hour, index) => (
        <div
          key={hour.toString()}
          className="relative min-h-[var(--week-cells-height)] border-b border-border/70 last:border-b-0"
        >
          {index > 0 && (
            <span className="absolute -top-3 left-0 flex h-6 w-16 max-w-full items-center justify-end bg-background pe-1 text-[10px] text-muted-foreground/70 sm:pe-2 sm:text-xs">
              {format(hour, "h a")}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

interface PositionedEventProps {
  positionedEvent: PositionedEvent;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
}

function PositionedEvent({
  positionedEvent,
  onEventClick,
}: PositionedEventProps) {
  return (
    <div
      key={positionedEvent.event.id}
      className="absolute z-10 px-0.5"
      style={{
        top: `${positionedEvent.top}px`,
        height: `${positionedEvent.height}px`,
        left: `${positionedEvent.left * 100}%`,
        width: `${positionedEvent.width * 100}%`,
        zIndex: positionedEvent.zIndex,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="size-full">
        <DraggableEvent
          event={positionedEvent.event}
          view="week"
          onClick={(e) => onEventClick(positionedEvent.event, e)}
          showTime
          height={positionedEvent.height}
        />
      </div>
    </div>
  );
}

function WeekViewDayColumns() {
  const { allDays, visibleDays, eventCollection, currentDate, onEventClick } =
    useWeekViewContext();
  const viewPreferences = useViewPreferences();

  const { currentTimePosition, currentTimeVisible } = useCurrentTimeIndicator(
    currentDate,
    "week",
  );

  return (
    <>
      {allDays.map((day) => {
        const isDayVisible = viewPreferences.showWeekends || !isWeekend(day);
        const visibleDayIndex = visibleDays.findIndex(
          (d) => d.getTime() === day.getTime(),
        );

        const positionedEvents =
          eventCollection.type === "week" && visibleDayIndex >= 0
            ? (eventCollection.positionedEvents[visibleDayIndex] ?? [])
            : [];

        return (
          <div
            key={day.toString()}
            className={cn(
              "relative grid auto-cols-fr border-r border-border/70 last:border-r-0",
              !isDayVisible && "w-0 overflow-hidden",
            )}
            data-today={isToday(day) || undefined}
            style={{ visibility: isDayVisible ? "visible" : "hidden" }}
          >
            {positionedEvents.map((positionedEvent: PositionedEvent) => (
              <PositionedEvent
                key={positionedEvent.event.id}
                positionedEvent={positionedEvent}
                onEventClick={onEventClick}
              />
            ))}

            {currentTimeVisible && isToday(day) && (
              <div
                className="pointer-events-none absolute right-0 left-0 z-20"
                style={{ top: `${currentTimePosition}%` }}
              >
                <div className="relative flex items-center">
                  <div className="absolute -left-1 h-2 w-2 rounded-full bg-primary"></div>
                  <div className="h-[2px] w-full bg-primary"></div>
                </div>
              </div>
            )}

            <WeekViewDayTimeSlots day={day} />
          </div>
        );
      })}
    </>
  );
}

function WeekViewDayTimeSlots({ day }: { day: Date }) {
  const { hours, onEventCreate } = useWeekViewContext();

  return (
    <>
      {hours.map((hour) => {
        const hourValue = getHours(hour);
        return (
          <div
            key={hour.toString()}
            className="relative min-h-[var(--week-cells-height)] border-b border-border/70 last:border-b-0"
          >
            {[0, 1, 2, 3].map((quarter) => {
              const quarterHourTime = hourValue + quarter * 0.25;
              return (
                <DroppableCell
                  key={`${hour.toString()}-${quarter}`}
                  id={`week-cell-${day.toISOString()}-${quarterHourTime}`}
                  date={day}
                  time={quarterHourTime}
                  className={cn(
                    "absolute h-[calc(var(--week-cells-height)/4)] w-full",
                    quarter === 0 && "top-0",
                    quarter === 1 && "top-[calc(var(--week-cells-height)/4)]",
                    quarter === 2 && "top-[calc(var(--week-cells-height)/4*2)]",
                    quarter === 3 && "top-[calc(var(--week-cells-height)/4*3)]",
                  )}
                  onClick={() => {
                    const startTime = new Date(day);
                    startTime.setHours(hourValue);
                    startTime.setMinutes(quarter * 15);
                    onEventCreate(startTime);
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}
