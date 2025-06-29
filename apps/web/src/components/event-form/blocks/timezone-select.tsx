import { useCallback, useId, useMemo, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const timezones = Intl.supportedValuesOf("timeZone");

const formattedTimezones = timezones
  .map((timezone) => {
    const formatter = new Intl.DateTimeFormat("en", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(new Date());
    const offset =
      parts.find((part) => part.type === "timeZoneName")?.value || "";
    const modifiedOffset = offset === "GMT" ? "GMT+0" : offset;

    return {
      value: timezone,
      label: `(${modifiedOffset}) ${timezone.replace(/_/g, " ")}`,
      numericOffset: Number.parseInt(
        offset.replace("GMT", "").replace("+", "") || "0",
      ),
    };
  })
  .sort((a, b) => a.numericOffset - b.numericOffset);

const getShortOffset = (value: string) => {
  const timezone = formattedTimezones.find(
    (timezone) => timezone.value === value,
  );
  if (!timezone) return "";

  return timezone.label.split("(")[1]?.split(")")[0] || "";
};

type TimezoneSelectProps = {
  className?: string;
  value: string;
  onChange: (value: string) => void;
};

export function TimezoneSelect({
  className,
  value,
  onChange,
}: TimezoneSelectProps) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const triggerText = value ? getShortOffset(value) : "Timezone";

  const sortedTimezones = useMemo(() => {
    if (value) {
      return [
        ...formattedTimezones.filter((timezone) => timezone.value === value),
        ...formattedTimezones.filter((timezone) => timezone.value !== value),
      ];
    }
    return formattedTimezones;
  }, [value]);

  const filterFn = useCallback(
    (value: string, search: string) => {
      const timezone = sortedTimezones.find((tz) => tz.value === value);
      if (!timezone) return 0;

      const normalizedValue = value.toLowerCase();
      const normalizedLabel = timezone.label.toLowerCase();
      const normalizedSearch = search.toLowerCase();

      return normalizedValue.includes(normalizedSearch) ||
        normalizedLabel.includes(normalizedSearch)
        ? 1
        : 0;
    },
    [sortedTimezones],
  );

  return (
    <div className="flex flex-1">
      <Label htmlFor={id} className="sr-only">
        Select a timezone
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between rounded-md border border-input !bg-background/40 font-medium outline-offset-0 outline-none select-none hover:!bg-accent focus-visible:outline-[3px] dark:hover:!bg-accent/50",
              className,
            )}
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {triggerText}
            </span>
            <ChevronDownIcon
              size={16}
              className="shrink-0 text-muted-foreground/80"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-72 min-w-[var(--radix-popper-anchor-width)] border-input p-0"
          align="end"
          side="bottom"
          sideOffset={10}
        >
          <Command filter={filterFn}>
            <CommandInput
              placeholder="Search timezone..."
              className="h-8 p-0 text-xs"
              wrapperClassName="[&_svg]:size-4 px-4"
            />
            <CommandList className="max-h-32">
              <CommandEmpty>No timezone found.</CommandEmpty>
              <CommandGroup className="py-1">
                {sortedTimezones.map(({ value: itemValue, label }) => (
                  <CommandItem
                    key={itemValue}
                    value={itemValue}
                    onSelect={(currentValue) => {
                      if (currentValue !== value) {
                        onChange(currentValue);
                        setOpen(false);
                      }
                    }}
                    className="text-xs [&_svg]:size-3.5"
                  >
                    {label}
                    {value === itemValue && (
                      <CheckIcon size={16} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
