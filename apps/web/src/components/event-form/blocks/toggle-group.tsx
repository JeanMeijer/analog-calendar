import { RotateCcw, Sun } from "lucide-react";

import { withForm } from "@/components/event-form/hooks/form";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { defaultFormOptions } from "../support/form-defaults";

const ToggleGroup = withForm({
  ...defaultFormOptions,
  render: ({ form }) => {
    return (
      <div className="relative flex h-fit border-y border-muted-foreground/10 py-1.5">
        <form.Field
          name="isAllDay"
          listeners={{
            onChange: ({ value }) => {
              if (value) {
                form.setFieldValue("startTime", null);
                form.setFieldValue("endTime", null);
              }
            },
          }}
        >
          {(field) => (
            <ToggleWithLabel
              name={field.name}
              label="All day"
              icon={<Sun className="size-4 text-muted-foreground/80" />}
              checked={field.state.value}
              onCheckedChange={field.handleChange}
            />
          )}
        </form.Field>
        <Separator
          orientation="vertical"
          className="bg-muted-foreground/10 data-[orientation=vertical]:h-8"
        />
        <form.Field
          name="repeats"
          listeners={{
            onChange: ({ value, fieldApi }) => {
              if (!value) {
                const startDate = fieldApi.form.getFieldValue("startDate");
                form.setFieldValue("endDate", startDate);
                form.resetField("repeatType");
              } else {
                form.setFieldValue("repeatType", "daily");
              }
            },
          }}
        >
          {(field) => (
            <ToggleWithLabel
              className="justify-end"
              name={field.name}
              label="Repeat"
              icon={<RotateCcw className="size-4 text-muted-foreground/80" />}
              checked={field.state.value}
              onCheckedChange={field.handleChange}
            />
          )}
        </form.Field>
      </div>
    );
  },
});

function ToggleWithLabel({
  name,
  label,
  className,
  icon,
  checked,
  onCheckedChange,
}: {
  name: string;
  label: string;
  className?: string;
  icon: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className={cn("flex flex-1 items-center gap-x-3", className)}>
      {icon}
      <Label htmlFor={name} className="sr-only">
        Toggle {label}
      </Label>
      <Switch
        id={name}
        checked={checked}
        type="button"
        onCheckedChange={onCheckedChange}
        className="h-5 data-[state=checked]:bg-blue-400 [&>span]:size-4 data-[state=checked]:[&>span]:translate-x-5"
      />
      <div className="mr-1 text-sm text-muted-foreground select-none">
        {label}
      </div>
    </div>
  );
}

export default ToggleGroup;
