import { MapPin } from "lucide-react";

import { useFieldContext } from "@/components/event-form/hooks/form-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LocationField = () => {
  const field = useFieldContext<string>();

  return (
    <div className="flex items-center gap-x-3">
      <MapPin className="size-4 shrink-0 text-muted-foreground/80" />
      <Label htmlFor="location" className="sr-only">
        Location
      </Label>
      <Input
        id="location"
        type="text"
        placeholder="Add location..."
        aria-invalid={field.state.meta.isValid === false}
        className="peer h-6 rounded-none border-none !bg-transparent p-0.5 shadow-none focus-visible:ring-0 aria-invalid:text-destructive"
        value={field.state.value ?? ""}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </div>
  );
};

export default LocationField;
