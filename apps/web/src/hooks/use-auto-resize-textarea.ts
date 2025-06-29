import { useCallback, useEffect, useRef } from "react";

export function useAutoResizeTextarea(maxHeight?: number) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = useCallback(
    (textarea: HTMLTextAreaElement) => {
      textarea.style.height = "auto";
      let newHeight = textarea.scrollHeight;

      if (maxHeight) {
        newHeight = Math.min(newHeight, maxHeight);
      } else {
        const computedMaxHeight = Number.parseFloat(
          getComputedStyle(textarea).maxHeight,
        );
        if (
          computedMaxHeight &&
          computedMaxHeight !== Number.POSITIVE_INFINITY
        ) {
          newHeight = Math.min(newHeight, computedMaxHeight);
        }
      }
      textarea.style.height = `${newHeight}px`;
    },
    [maxHeight],
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const supportsFieldSizing =
      CSS.supports("field-sizing", "content") ||
      "fieldSizing" in document.documentElement.style;

    if (!supportsFieldSizing) {
      const handleInput = () => autoResize(textarea);
      textarea.addEventListener("input", handleInput);
      return () => {
        textarea.removeEventListener("input", handleInput);
      };
    }
  }, [autoResize]);

  return textareaRef;
}
