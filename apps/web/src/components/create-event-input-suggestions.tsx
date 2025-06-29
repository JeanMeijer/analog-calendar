import { ReactRenderer } from "@tiptap/react";
import { type MentionOptions } from "@tiptap/extension-mention";
import tippy, { Instance, Props } from "tippy.js";

import { generateDateSuggestions } from "@/lib/event-input";
import TimeSelector from "./time-selector";

type MentionSuggestion = MentionOptions["suggestion"];

type SuggestionItem = {
  type: "time" | "duration" | "date";
  label: string;
  value: string;
};

export default {
  items: ({ query }: { query: string }) => {
    const suggestions: SuggestionItem[] = [
      // Time suggestions
      { type: "time", label: "9:00 AM", value: "09:00" },
      { type: "time", label: "10:00 AM", value: "10:00" },
      { type: "time", label: "11:00 AM", value: "11:00" },
      { type: "time", label: "12:00 PM", value: "12:00" },
      { type: "time", label: "1:00 PM", value: "13:00" },
      { type: "time", label: "2:00 PM", value: "14:00" },
      { type: "time", label: "3:00 PM", value: "15:00" },
      { type: "time", label: "4:00 PM", value: "16:00" },
      { type: "time", label: "5:00 PM", value: "17:00" },
      { type: "time", label: "6:00 PM", value: "18:00" },
      { type: "time", label: "7:00 PM", value: "19:00" },
      { type: "time", label: "8:00 PM", value: "20:00" },
      { type: "time", label: "9:00 PM", value: "21:00" },
      { type: "time", label: "10:00 PM", value: "22:00" },
      { type: "time", label: "11:00 PM", value: "23:00" },
      { type: "time", label: "12:00 AM", value: "00:00" },
      // Duration suggestions
      { type: "duration", label: "15m", value: "15m" },
      { type: "duration", label: "30m", value: "30m" },
      { type: "duration", label: "45m", value: "45m" },
      { type: "duration", label: "1h", value: "1h" },
      { type: "duration", label: "2h", value: "2h" },
      { type: "duration", label: "3h", value: "3h" },
      { type: "duration", label: "4h", value: "4h" },
    ];

    const dateSuggestions = generateDateSuggestions(query);
    suggestions.push(...dateSuggestions);

    return suggestions
      .filter((item) => {
        if (item.type === "date") {
          return true;
        }
        return item.label.toLowerCase().startsWith(query.toLowerCase());
      })
      .reduce((acc, item) => {
        const sameTypeCount = acc.filter((i) => i.type === item.type).length;
        const maxCount = item.type === "date" ? 3 : 5;
        if (sameTypeCount < maxCount) {
          acc.push(item);
        }
        return acc;
      }, [] as SuggestionItem[]);
  },

  render: () => {
    let component: ReactRenderer<any>;
    let popup: Instance<Props>;

    return {
      onStart: (props) => {
        component = new ReactRenderer(TimeSelector, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy(document.body, {
          getReferenceClientRect: () => {
            const rect = props.clientRect?.();
            return rect || new DOMRect();
          },
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup?.setProps({
          getReferenceClientRect: () => {
            const rect = props.clientRect?.();
            return rect || new DOMRect();
          },
        });
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup?.hide();
          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup?.destroy();
        component.destroy();
      },
    };
  },
} as MentionSuggestion;
