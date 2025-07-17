import { Google, Microsoft, Zoom } from "@/components/icons";

export const providers = [
  {
    name: "Gmail",
    icon: Google,
    id: "google" as const,
  },
  {
    name: "Outlook",
    icon: Microsoft,
    id: "microsoft" as const,
  },
];

export type ProviderId = "google" | "microsoft";
