import { cn } from "@/lib/utils";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

type SuggestionItem = {
  type: "time" | "duration";
  label: string;
  value: string;
  id: string;
};

export default forwardRef(function TimeSelector(
  props: {
    items: SuggestionItem[];
    command: (item: SuggestionItem) => void;
  },
  ref
) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command({
        ...item,
        id: "mention-" + item.type,
      });
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  const groupedItems = props.items.reduce(
    (acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type]?.push(item);
      return acc;
    },
    {} as Record<string, SuggestionItem[]>
  );

  return (
    <div
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md"
      )}
    >
      <div className="flex flex-col gap-2">
        {Object.entries(groupedItems).map(([type, items]) => (
          <div key={type}>
            <p className="px-1 pb-1 text-sm text-muted-foreground font-medium capitalize">
              {type}
            </p>
            <div className="flex flex-col gap-1 items-start">
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => selectItem(props.items.indexOf(item))}
                  data-state={
                    props.items.indexOf(item) === selectedIndex
                      ? "selected"
                      : "unselected"
                  }
                  className="px-2 rounded-sm hover:bg-accent w-full text-left text-sm data-[state=selected]:bg-accent"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {props.items.length === 0 && (
        <div className="px-1 text-sm text-muted-foreground font-medium">
          No results
        </div>
      )}
    </div>
  );
});
