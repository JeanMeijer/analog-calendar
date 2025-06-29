import { useId } from "react";
import { MessageSquare } from "lucide-react";

import { useFieldContext } from "@/components/event-form/hooks/form-context";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";

const DescriptionField = ({ maxLength = 200 }: { maxLength?: number }) => {
  const id = useId();
  const field = useFieldContext<string>();
  const textareaRef = useAutoResizeTextarea(120);

  return (
    <div className="flex gap-x-3">
      <MessageSquare className="mt-1 size-4 shrink-0 text-muted-foreground/80" />
      <Label htmlFor={id} className="hidden">
        Event description
      </Label>
      <Textarea
        ref={textareaRef}
        id={id}
        placeholder="Add description..."
        value={field.state.value ?? ""}
        maxLength={maxLength}
        rows={1}
        onChange={(e) => field.handleChange(e.target.value)}
        className="scrollbar-hidden field-sizing-content max-h-29.5 min-h-0 resize-none rounded-none border-none p-0.5 shadow-none focus-visible:ring-0"
      />
    </div>
  );
};

export default DescriptionField;
