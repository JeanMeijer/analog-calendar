import { Google, Microsoft, Zoom } from "@/components/icons";

export const providers = [
  {
    name: "Gmail",
    icon: Google,
    providerId: "google" as const,
  },
  {
    name: "Outlook",
    icon: Microsoft,
    providerId: "microsoft" as const,
  },
  {
    name: "Zoom",
    icon: Zoom,
    providerId: "zoom" as const,
  },
];

export type ProviderId = (typeof providers)[number]["providerId"];
