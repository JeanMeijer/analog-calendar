import * as React from "react";
import { Temporal } from "@js-temporal/polyfill";

type Granularity = "minute" | "second";

interface ZonedDateTimeProviderProps {
  timeZone: string;
  tick?: Granularity; // default 'minute'; pass 'second' for per-second updates
  children: React.ReactNode;
}

const ZonedDateTimeContext = React.createContext<Temporal.ZonedDateTime | null>(
  null,
);

/**
 * Calculates milliseconds until the *next* tick in the given granularity.
 */
function msUntilNext(now: Temporal.ZonedDateTime, unit: Granularity): number {
  const next =
    unit === "minute"
      ? now
          .add({ minutes: 1 })
          .with({ second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 })
      : now
          .add({ seconds: 1 })
          .with({ millisecond: 0, microsecond: 0, nanosecond: 0 });
  return Number(next.epochMilliseconds - now.epochMilliseconds);
}

export function ZonedDateTimeProvider({
  timeZone,
  tick = "minute",
  children,
}: ZonedDateTimeProviderProps) {
  const [dateTime, setDateTime] = React.useState(() =>
    Temporal.Now.zonedDateTimeISO(timeZone),
  );
  const timerRef = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    setDateTime(Temporal.Now.zonedDateTimeISO(timeZone));

    const scheduleNextTick = () => {
      const now = Temporal.Now.zonedDateTimeISO(timeZone);
      const delay = msUntilNext(now, tick);

      timerRef.current = window.setTimeout(() => {
        setDateTime(Temporal.Now.zonedDateTimeISO(timeZone));
        scheduleNextTick();
      }, delay);
    };

    scheduleNextTick();
    return () => clearTimeout(timerRef.current);
  }, [timeZone, tick]);

  return (
    <ZonedDateTimeContext.Provider value={dateTime}>
      {children}
    </ZonedDateTimeContext.Provider>
  );
}

export function useZonedDateTime() {
  const ctx = React.useContext(ZonedDateTimeContext);

  if (ctx === null) {
    throw new Error(
      "useZonedDateTime must be used inside a <ZonedDateTimeProvider>",
    );
  }

  return ctx;
}
