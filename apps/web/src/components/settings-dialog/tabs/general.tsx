import React, { JSX, useId } from "react";
import { format } from "@formkit/tempo";
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
import {
  SettingsPage,
  SettingsSection,
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from "./settings-page";

const themes = [
  {
    value: "system",
    name: "System",
    icon: SystemTheme,
  },
  {
    value: "light",
    name: "Light",
    icon: LightTheme,
  },
  {
    value: "dark",
    name: "Dark",
    icon: DarkTheme,
  },
];

// Array where index represents the day number (0-6) and value is the day name
const weekDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

type WeekDay = (typeof weekDays)[number];

function ThemePicker() {
  const { theme, setTheme } = useTheme();

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      className="gap-x-4 data-[variant=outline]:shadow-none"
      value={theme ?? "system"}
      onValueChange={(value: string) => {
        if (!value) {
          return;
        }

        setTheme(value);
      }}
    >
      {themes.map((theme) => (
        <ToggleGroupItem
          className="group/theme h-fit flex-1 border-none px-0 hover:bg-transparent data-[state=on]:bg-transparent"
          value={theme.value}
          key={theme.value}
        >
          <div className="relative w-full">
            <theme.icon className="size-full rounded-md ring-offset-popover group-aria-checked/theme:ring-2 group-aria-checked/theme:ring-ring/40 group-aria-checked/theme:ring-offset-4 dark:group-aria-checked/theme:ring-ring" />
            <p className="mt-3 text-sm text-muted-foreground group-aria-checked/theme:text-foreground">
              {theme.name}
            </p>
          </div>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

function StartOfWeekPicker() {
  const [calendarSettings, setCalendarSettings] = useCalendarSettings();
  const value = weekDays[calendarSettings.weekStartsOn - 1];

  return (
    <div className="w-48">
      <Label htmlFor="settings-start-of-week" className="sr-only">
        Start of week
      </Label>
      <Select
        value={value}
        onValueChange={(value: WeekDay) => {
          const weekStartsOn = weekDays.indexOf(value) + 1;

          setCalendarSettings((prev) => ({
            ...prev,
            weekStartsOn: weekStartsOn as 1 | 2 | 3 | 4 | 5 | 6 | 7,
          }));
        }}
      >
        <SelectTrigger id="settings-start-of-week">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="monday">Monday</SelectItem>
          <SelectItem value="tuesday">Tuesday</SelectItem>
          <SelectItem value="wednesday">Wednesday</SelectItem>
          <SelectItem value="thursday">Thursday</SelectItem>
          <SelectItem value="friday">Friday</SelectItem>
          <SelectItem value="saturday">Saturday</SelectItem>
          <SelectItem value="sunday">Sunday</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function TimeFormatPicker() {
  const [calendarSettings, setCalendarSettings] = useCalendarSettings();

  const time = React.useRef(new Date());

  return (
    <div className="w-48">
      <Label htmlFor="settings-time-format" className="sr-only">
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
        <SelectTrigger id="settings-time-format">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem className="tabular-nums" value="24h">
            {format(time.current, "HH:mm")}
          </SelectItem>
          <SelectItem className="tabular-nums" value="12h">
            {format(time.current, "h:mm a")}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function General() {
  return (
    <SettingsPage>
      <SettingsSection>
        <SettingsSectionHeader>
          <SettingsSectionTitle>Theme</SettingsSectionTitle>
          <SettingsSectionDescription>
            Select a theme to customize the look of your calendar
          </SettingsSectionDescription>
        </SettingsSectionHeader>
        <ThemePicker />
      </SettingsSection>

      <SettingsSection>
        <div className="flex items-center justify-between gap-4">
          <SettingsSectionHeader>
            <SettingsSectionTitle>Start of week</SettingsSectionTitle>
            <SettingsSectionDescription>
              Which day should be shown as the first day of the week.
            </SettingsSectionDescription>
          </SettingsSectionHeader>
          <StartOfWeekPicker />
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
          <SettingsSectionHeader>
            <SettingsSectionTitle>Time format</SettingsSectionTitle>
            <SettingsSectionDescription>
              Which format used to display a time.
            </SettingsSectionDescription>
          </SettingsSectionHeader>
          <TimeFormatPicker />
        </div>
      </SettingsSection>
    </SettingsPage>
  );
}
