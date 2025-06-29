import { useCallback, useRef } from "react";
import { useToggle, useUpdateEffect } from "@react-hookz/web";

export const useExpandingInput = (value: string) => {
  const [focused, toggleFocused] = useToggle(false);
  const [expanded, toggleExpanded] = useToggle(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const placeCursorAtEnd = useCallback(() => {
    if (!textareaRef.current) return;
    textareaRef.current.focus();
    textareaRef.current.selectionStart = textareaRef.current.value.length ?? 0;
    textareaRef.current.selectionEnd = textareaRef.current.value.length ?? 0;
  }, []);

  useUpdateEffect(() => {
    if (value.length > 30 && focused && !expanded) {
      toggleExpanded(true);
      setTimeout(() => {
        placeCursorAtEnd();
      }, 100);
    }
    if (value.length <= 30 && expanded && focused) {
      toggleExpanded(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
    if (!focused && expanded) {
      toggleExpanded(false);
    }
  }, [value, focused, expanded]);

  return {
    expanded,
    setFocused: toggleFocused,
    refs: { input: inputRef, textarea: textareaRef },
  };
};
