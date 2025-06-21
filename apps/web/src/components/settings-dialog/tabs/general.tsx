import { useId } from "react";
import { useTheme } from "next-themes";

import DarkTheme from "@/assets/theme-dark.svg";
import LightTheme from "@/assets/theme-light.svg";
import SystemTheme from "@/assets/theme-system.svg";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCalendarSettings } from "../hooks/use-calendar-settings";

const themes = {
  system: {
    name: "System",
    icon: SystemTheme,
  },
  light: {
    name: "Light",
    icon: LightTheme,
  },
  dark: {
    name: "Dark",
    icon: DarkTheme,
  },
};

// Array where index represents the day number (0-6) and value is the day name
const weekDays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export function General() {
  const { theme, setTheme } = useTheme();
  const [calendarSettings, setCalendarSettings] = useCalendarSettings();

  const startOfWeekId = useId();
  // const dateFormatId = useId();
  const timeFormatId = useId();

  return (
    <div className="flex flex-col gap-6 px-3">
      <section className="space-y-5">
        <div className="flex flex-col gap-0.5">
          <p className="text-md font-light">Theme</p>
          <p className="text-sm text-muted-foreground">
            Select a theme to customize the look of your calendar
          </p>
        </div>
        <ToggleGroup
          type="single"
          variant="outline"
          className="gap-x-4 data-[variant=outline]:shadow-none"
          value={theme ?? "system"}
          onValueChange={(value: string) => {
            if (value) setTheme(value);
          }}
        >
          {Object.entries(themes).map(([key, value]) => (
            <ToggleGroupItem
              className="group/theme h-fit flex-1 border-none px-0 hover:bg-transparent data-[state=on]:bg-transparent"
              value={key}
              key={key}
            >
              <div className="relative w-full">
                <value.icon className="size-full rounded-md ring-offset-popover group-aria-checked/theme:ring-2 group-aria-checked/theme:ring-ring/40 group-aria-checked/theme:ring-offset-4 dark:group-aria-checked/theme:ring-ring" />
                <p className="mt-3 text-sm font-light text-muted-foreground group-aria-checked/theme:text-foreground">
                  {value.name}
                </p>
              </div>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </section>

      <section className="space-y-4">
        <p className="text-md font-light">Locale and format</p>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="mb-1 text-sm font-light text-foreground/80">
              Start of week
            </h3>
            <p className="text-xs text-pretty text-muted-foreground">
              Which day should be shown as the first day of the week.
            </p>
          </div>
          <div className="w-48">
            <Label htmlFor={startOfWeekId} className="sr-only">
              Start of week
            </Label>
            <Select
              value={weekDays[calendarSettings.weekStartsOn]}
              onValueChange={(value: string) => {
                const dayNumber = weekDays.indexOf(
                  value as (typeof weekDays)[number],
                );
                setCalendarSettings((prev) => ({
                  ...prev,
                  weekStartsOn: dayNumber as 0 | 1 | 2 | 3 | 4 | 5 | 6,
                }));
              }}
            >
              <SelectTrigger id={startOfWeekId}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sunday">Sunday</SelectItem>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
                <SelectItem value="saturday">Saturday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="mb-1 text-sm font-light text-foreground/80">
              Date format
            </h3>
            <p className="text-xs text-pretty text-muted-foreground">
              Which format used to display a date.
            </p>
          </div>
          <div className="w-48">
            <Label htmlFor={dateFormatId} className="sr-only">
              Date format
            </Label>
            <Select
              value={calendarSettings.locale}
              onValueChange={(value: string) => {
                setCalendarSettings((prev) => ({ ...prev, locale: value }));
              }}
            >
              <SelectTrigger id={dateFormatId}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">16 Nov 2023</SelectItem>
                <SelectItem value="en-GB">16/11/2023</SelectItem>
                <SelectItem value="en-CA">11/16/2023</SelectItem>
                <SelectItem value="en-ISO">2023-11-16</SelectItem>
                <SelectItem value="en-AU">Nov 16, 2023</SelectItem>
                <SelectItem value="en-NZ">16-11-2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div> */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="mb-1 text-sm font-light text-foreground/80">
              Time format
            </h3>
            <p className="text-xs text-pretty text-muted-foreground">
              Which format used to display a time.
            </p>
          </div>
          <div className="w-48">
            <Label htmlFor={timeFormatId} className="sr-only">
              Time format
            </Label>
            <Select
              value={calendarSettings.use12Hour ? "12h" : "24h"}
              onValueChange={(value: string) => {
                setCalendarSettings((prev) => ({
                  ...prev,
                  use12Hour: value === "12h",
                }));
              }}
            >
              <SelectTrigger id={timeFormatId}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">16:30</SelectItem>
                <SelectItem value="12h">4:30 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
    </div>
  );
}
