import { format } from "@formkit/tempo";

import { useCalendarSettings } from "@/atoms/calendar-settings";

interface TimeIndicatorProps {
  currentTimePosition: number;
  hour: Date;
}

export function TimeIndicator({
  currentTimePosition,
  hour,
}: TimeIndicatorProps) {
  const { use12Hour } = useCalendarSettings();

  return (
    <div
      className="pointer-events-none absolute right-0 left-0"
      style={{ top: `${currentTimePosition}%` }}
    >
      <div className="relative flex items-center">
        <div className="absolute flex h-4 w-20 items-center justify-end border-r border-transparent">
          <p className="z-[1000] pe-2 text-[10px] font-medium text-red-500/80 tabular-nums sm:pe-4 sm:text-xs">
            {use12Hour ? format(hour, "h aaa") : format(hour, "HH:mm")}
          </p>
        </div>
        <div className="h-0.5 w-20"></div>
        <div className="h-0.5 grow bg-red-500/10"></div>
      </div>
    </div>
  );
}
