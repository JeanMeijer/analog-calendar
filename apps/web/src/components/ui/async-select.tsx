import { useCallback, useEffect, useState } from "react";
import type { PopoverContentProps } from "@radix-ui/react-popover";
import { useDebouncedEffect, useMap, useMountEffect } from "@react-hookz/web";
import { Check, ChevronDown, Loader2 } from "lucide-react";

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

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

export interface AsyncSelectProps<T> {
  /** Async function to fetch options */
  fetcher: (query?: string) => Promise<T[]>;
  /** Preload all data ahead of time */
  preload?: boolean;
  /** Function to filter options */
  filterFn?: (option: T, query: string) => boolean;
  /** Function to render each option */
  renderOption: (option: T) => React.ReactNode;
  /** Function to get the value from an option */
  getOptionValue: (option: T) => string;
  /** Function to get the display value for the selected options */
  getDisplayValue: (options: T[]) => React.ReactNode;
  /** Custom not found message */
  notFound?: React.ReactNode;
  /** Custom loading skeleton */
  loadingSkeleton?: React.ReactNode;
  /** Currently selected values */
  value: T[];
  /** Callback when selection changes */
  onChange: (value: T[]) => void;
  /** Label for the select field */
  label: string;
  /** Placeholder text when no selection */
  placeholder?: string;
  /** Placeholder text when searching */
  searchPlaceholder?: string;
  /** Disable the entire select */
  disabled?: boolean;
  /** Custom width for the popover */
  width?: string | number;
  /** Custom class names */
  className?: string;
  /** Custom trigger button class names */
  triggerClassName?: string;
  /** Custom no results message */
  noResultsMessage?: string;
  /** Allow clearing the selection */
  clearable?: boolean;
  /** Enable multiple selection mode */
  multiple?: boolean;
  /** Failed validation state */
  isInvalid?: boolean;
  /** Custom popover content props */
  popoverContentProps?: PopoverContentProps;
}

export function AsyncSelect<T>({
  fetcher,
  preload,
  filterFn,
  renderOption,
  getOptionValue,
  getDisplayValue,
  notFound,
  loadingSkeleton,
  label,
  placeholder = "Select...",
  searchPlaceholder,
  value,
  onChange,
  disabled = false,
  className,
  triggerClassName,
  noResultsMessage,
  clearable = true,
  multiple = false,
  isInvalid = false,
  popoverContentProps,
}: AsyncSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalOptions, setOriginalOptions] = useState<T[]>([]);

  const cache = useMap<string, T[]>();

  const getCachedData = useCallback(
    (cacheKey: string, query?: string) => {
      if (!cache.has(cacheKey)) return false;
      const cachedData = cache.get(cacheKey) ?? [];
      setOptions(cachedData);
      if (!query) setOriginalOptions(cachedData);
      return true;
    },
    [cache],
  );

  const fetchOptions = useCallback(
    async (query?: string) => {
      const cacheKey = query ?? "__initial__";
      if (getCachedData(cacheKey, query)) return;
      try {
        setLoading(true);
        setError(null);
        const data = await fetcher(query);
        cache.set(cacheKey, data);
        setOptions(data);
        if (!query) setOriginalOptions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch options",
        );
      } finally {
        setLoading(false);
      }
    },
    [fetcher, cache, getCachedData],
  );

  const clearSearch = useCallback(() => setOptions(value), [value]);

  useDebouncedEffect(
    () => {
      if (preload) return;
      if (searchTerm) {
        fetchOptions(searchTerm);
      } else {
        clearSearch();
      }
    },
    [searchTerm, preload, fetchOptions],
    preload ? 0 : 500,
  );

  useMountEffect(() => value.length === 0 && fetchOptions());

  useEffect(() => {
    if (!preload) return;
    if (searchTerm) {
      setOptions(
        originalOptions.filter((option) =>
          filterFn ? filterFn(option, searchTerm) : true,
        ),
      );
    } else {
      setOptions(originalOptions);
    }
  }, [preload, filterFn, originalOptions, searchTerm]);

  const handleSelect = useCallback(
    (currentValue: string) => {
      const selectedOption = options.find(
        (opt) => getOptionValue(opt) === currentValue,
      );
      if (!selectedOption) return;

      const isCurrentlySelected = value.some(
        (v) => getOptionValue(v) === currentValue,
      );

      let newValues: T[];

      if (multiple) {
        newValues = isCurrentlySelected
          ? value.filter((v) => getOptionValue(v) !== currentValue)
          : [...value, selectedOption];
      } else {
        newValues = clearable && isCurrentlySelected ? [] : [selectedOption];
        setOpen(false);
      }
      onChange(newValues);
    },
    [value, onChange, clearable, multiple, options, getOptionValue],
  );

  const showSkeleton = loading && options.length === 0;
  const showNotFound = !loading && !error && options.length === 0;
  const showLoader = loading && options.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={isInvalid}
          className={cn(
            "group/async-select w-full justify-between font-normal",
            disabled && "cursor-not-allowed opacity-50",
            triggerClassName,
          )}
          disabled={disabled}
        >
          {value.length === 0 ? placeholder : getDisplayValue(value)}
          <ChevronDown
            className="opacity-50 group-hover/async-select:opacity-100"
            size={10}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", className)} {...popoverContentProps}>
        <Command className="[&_div[cmdk-input-wrapper]]:px-3">
          <div className="relative">
            <CommandInput
              placeholder={
                searchPlaceholder ?? `Search ${label.toLowerCase()}...`
              }
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="rounded-none border-none focus-visible:ring-0"
            />
            {showLoader && (
              <div className="absolute top-1/2 right-2 flex -translate-y-1/2 transform items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
          <CommandList>
            {error && (
              <div className="p-4 text-center text-destructive">{error}</div>
            )}
            {showSkeleton && (loadingSkeleton || <DefaultLoadingSkeleton />)}
            {showNotFound &&
              (notFound || (
                <CommandEmpty>
                  {noResultsMessage ?? `No ${label.toLowerCase()} found.`}
                </CommandEmpty>
              ))}
            <CommandGroup forceMount>
              {options.map((option) => (
                <CommandItem
                  key={getOptionValue(option)}
                  value={getOptionValue(option)}
                  onSelect={handleSelect}
                >
                  {renderOption(option)}
                  <Check
                    className={cn(
                      "ml-auto size-4",
                      value.some(
                        (v) => getOptionValue(v) === getOptionValue(option),
                      )
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function DefaultLoadingSkeleton() {
  return (
    <CommandGroup forceMount>
      {[1, 2, 3].map((i) => (
        <CommandItem key={i} disabled>
          <div className="flex w-full items-center gap-2">
            <div className="h-6 w-6 animate-pulse rounded-full bg-border" />
            <div className="flex flex-1 flex-col gap-1">
              <div className="h-4 w-40 animate-pulse rounded bg-border" />
              <div className="h-3 w-32 animate-pulse rounded bg-border" />
            </div>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
