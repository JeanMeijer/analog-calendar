import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { CheckIcon, GlobeIcon } from "lucide-react";
import { matchSorter } from "match-sorter";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const timezones = Intl.supportedValuesOf("timeZone").concat(["UTC"]);

const formattedTimezones = timezones
  .map((timezone) => {
    const formatter = new Intl.DateTimeFormat("en", {
      timeZone: timezone,
      timeZoneName: "longOffset",
    });
    const parts = formatter.formatToParts(new Date());
    const offset =
      parts.find((part) => part.type === "timeZoneName")?.value || "";
    const modifiedOffset =
      offset === "GMT" || offset === "GMT-00:00" ? "GMT+00:00" : offset;
    const modifiedLabel = timezone
      .replace(/_/g, " ")
      .replaceAll("/", " - ")
      .replace("UTC", "Coordinated Universal Time");

    return {
      value: timezone,
      sign: modifiedOffset.includes("+") ? "+" : "-",
      offset: modifiedOffset.replace("GMT", "").slice(1),
      label: modifiedLabel,
      numericOffset: Number.parseInt(
        offset.replace("GMT", "").replace("+", "") || "0",
      ),
    };
  })
  .sort((a, b) => a.numericOffset - b.numericOffset);

interface TimezoneSelectProps {
  id?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  isDirty?: boolean;
}

export function TimezoneSelect({
  id,
  className,
  value,
  onChange,
  disabled,
}: TimezoneSelectProps) {
  const [open, setOpen] = React.useState<boolean>(false);

  const { sortedTimezones, displayValue } = React.useMemo(() => {
    if (!value) {
      const timezone = formattedTimezones.find((tz) => tz.value === value);

      return {
        sortedTimezones: formattedTimezones,
        displayValue: timezone,
      };
    }
    const sortedTimezones = [
      ...formattedTimezones.filter((timezone) => timezone.value === value),
      ...formattedTimezones.filter((timezone) => timezone.value !== value),
    ];

    const timezone = sortedTimezones.find((tz) => tz.value === value);

    return {
      sortedTimezones,
      displayValue: timezone,
    };
  }, [value]);

  // Search term entered in the input. We keep our own state so that we can
  // build a *filtered* timezone list and hand that exact list to the
  // virtualizer. This guarantees the virtualizer always knows the correct
  // row count and eliminates the "blank spot" artefacts seen when rows are
  // merely hidden via CSS.
  const [search, setSearch] = React.useState("");

  const filteredTimezones = React.useMemo(() => {
    if (!search) return sortedTimezones;

    // Use match-sorter for robust fuzzy matching across both the timezone value
    // (e.g. "Europe/London") and its human-readable label.
    return matchSorter(sortedTimezones, search, {
      keys: [(item) => item.value, (item) => item.label, (item) => item.offset],
    });
  }, [sortedTimezones, search]);

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (disabled) {
        return;
      }
      setOpen(open);
    },
    [disabled],
  );

  const onSelect = React.useCallback(
    (value: string) => {
      onChange(value);
      setOpen(false);
    },
    [onChange, setOpen],
  );

  return (
    <div className="flex flex-1">
      <Popover open={open && !disabled} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="ghost"
            size="sm"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-start gap-2.5 px-1.5", className)}
            disabled={disabled}
          >
            <GlobeIcon className="size-4 text-muted-foreground/80 hover:text-foreground" />
            {displayValue ? (
              <span
                className={cn(
                  "space-x-2 truncate text-sm",
                  !value && "text-muted-foreground",
                )}
              >
                <span className="pr-2">
                  <span className="text-muted-foreground/80">UTC</span>
                  <span className="inline-block w-2 text-center text-muted-foreground/80">
                    {displayValue.sign}
                  </span>
                  <span className="w-24 text-muted-foreground/80">
                    {displayValue.offset}
                  </span>
                </span>
                {displayValue.label}
              </span>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-96 min-w-(--radix-popper-anchor-width) p-0"
          align="end"
          side="bottom"
          sideOffset={4}
        >
          <Command shouldFilter={false} value={value}>
            <CommandInput
              placeholder="Search timezone..."
              className="h-8 p-0 text-sm"
              onValueChange={setSearch}
            />
            <CommandList className="max-h-48">
              <CommandEmpty>No timezone found.</CommandEmpty>
              <MemoizedList
                sortedTimezones={filteredTimezones}
                value={value}
                onSelect={onSelect}
              />
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface ListProps {
  sortedTimezones: typeof formattedTimezones;
  value: string;
  onSelect: (value: string) => void;
}

function List({ sortedTimezones, value, onSelect }: ListProps) {
  // Container ref is used by the virtualizer to observe scrolling.
  const parentRef = React.useRef<HTMLDivElement | null>(null);

  // This type represents a single timezone entry.
  type TimezoneItem = (typeof formattedTimezones)[number];

  // Roughly estimate each row height – 32px covers typical list item.
  const rowVirtualizer = useVirtualizer({
    count: sortedTimezones.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 6, // render a few extra rows for smoother scrolling
  });

  return (
    <CommandGroup className="py-1">
      {/* Scroll container for virtualization */}
      <div ref={parentRef} className="max-h-48 overflow-y-auto">
        {/* The large inner div gives the virtualizer space to position rows */}
        <div
          className="relative w-full"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const item = sortedTimezones[virtualRow.index] as TimezoneItem;
            if (!item) return null;

            const { value: itemValue, label, offset, sign } = item;

            return (
              <CommandItem
                key={itemValue}
                value={itemValue}
                onSelect={onSelect}
                className="absolute top-0 left-0 w-full text-sm tabular-nums [&_svg]:size-3.5"
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                <span>
                  <span className="text-muted-foreground/80">UTC</span>
                  <span className="inline-block w-2 text-center text-muted-foreground/80">
                    {sign}
                  </span>
                  <span className="w-24 text-muted-foreground/80">
                    {offset}
                  </span>
                </span>
                <span className="truncate">{label}</span>
                {value === itemValue ? <CheckIcon className="ml-auto" /> : null}
              </CommandItem>
            );
          })}
        </div>
      </div>
    </CommandGroup>
  );
}

export const MemoizedList = React.memo(List, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.onSelect === nextProps.onSelect &&
    prevProps.sortedTimezones === nextProps.sortedTimezones
  );
});
