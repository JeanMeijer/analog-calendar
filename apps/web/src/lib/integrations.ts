import { Zoom } from "@/components/icons";

export const integrations = [
  {
    id: "zoom" as const,
    name: "Zoom",
    icon: Zoom,
  },
];

export type Integration = "zoom";
