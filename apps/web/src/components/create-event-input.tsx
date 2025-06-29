"use client";

import { useState } from "react";
import Document from "@tiptap/extension-document";
import Mention from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import createEventInputSuggestions from "./create-event-input-suggestions";

export function CreateEventInput() {
  const [isEmpty, setIsEmpty] = useState(true);

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Paragraph,
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },

        deleteTriggerWithBackspace: true,
        suggestion: createEventInputSuggestions,
      }),
    ],
    content: "",
    injectCSS: false,
    immediatelyRender: false,
    editorProps: {
      handleKeyDown: (view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          // @ts-expect-error this property exists as a custom extension
          const isSuggestionActive = view.state.mention$.active;

          if (isSuggestionActive) {
            return false;
          }

          // Otherwise handle the enter key
          event.preventDefault();
          handleSubmit();
          return true;
        }
        return false;
      },
    },

    onUpdate: ({ editor }) => {
      const content = editor?.getText() || "";
      setIsEmpty(content.trim().length === 0);
    },
  });

  const handleSubmit = () => {
    const json = editor?.getJSON();
    const paragraph = json?.content?.find((node) => node.type === "paragraph");
    const content = paragraph?.content?.map((node) => node.text).join("");
    const sanitizedContent = content?.replace(/\s+$/, "");

    const mentions = paragraph?.content?.filter(
      (node) => node.type === "mention",
    );

    console.log({ content: sanitizedContent, mentions });
    editor?.commands.clearContent();
  };

  if (!editor) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", duration: 0.4 }}
      className={cn(
        "absolute bottom-5 left-1/2 z-50 -translate-x-1/2",
        "w-96 max-w-full",
      )}
    >
      <AnimatePresence>{isEmpty && <Placeholder />}</AnimatePresence>

      <EditorContent
        editor={editor}
        placeholder="Sales meeting at @22:00"
        className={cn(
          "flex items-center pl-2",
          "h-10 w-full min-w-0",
          "rounded-sm",
          "border bg-sidebar",
          "event-editor-content",
        )}
      />
    </motion.div>
  );
}

const Placeholder = () => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(2px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(2px)" }}
      transition={{ type: "spring", duration: 0.2 }}
      className="pointer-events-none absolute top-1/2 -translate-y-1/2 p-2 text-sm text-muted-foreground"
    >
      Sales meeting at @22:00
    </motion.div>
  );
};
