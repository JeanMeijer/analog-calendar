"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Mention from "@tiptap/extension-mention";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";

import createEventInputSuggestions from "./create-event-input-suggestions";
import { cn } from "@/lib/utils";
import { useState } from "react";

import { AnimatePresence, motion } from "motion/react";

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
      (node) => node.type === "mention"
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
      className="relative"
    >
      <AnimatePresence>{isEmpty && <Placeholder />}</AnimatePresence>

      <EditorContent
        editor={editor}
        placeholder="Sales meeting at @22:00"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "min-h-[32px] bg-input rounded-sm placeholder:text-muted-foreground p-2",
          "event-editor-content"
        )}
      />
    </motion.div>
  );
}

const Placeholder = () => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(2px)", x: -2 }}
      animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
      exit={{ opacity: 0, filter: "blur(2px)", x: -2 }}
      transition={{ type: "spring", duration: 0.4 }}
      className="text-muted-foreground text-sm absolute top-0 left-px p-2 pointer-events-none"
    >
      Sales meeting at @22:00
    </motion.div>
  );
};
