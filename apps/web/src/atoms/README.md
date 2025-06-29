# Jotai Atoms

Always include an "analog-" prefix for persisted atoms.  
Always re-export the atoms in `@/atoms/index.ts`.  
Preferably try to create custom hooks to use atoms (e.g. below).

```typescript
// atoms/user-settings.ts
import { atomWithStorage } from "jotai/utils";

export const userSettingsAtom = atomWithStorage("analog-user-settings", {
  theme: "light",
});

// hooks/use-user-settings.ts
import { useAtom } from "jotai";
import { userSettingsAtom } from "@/atoms/user-settings";

export function useUserSettings() {
  useAtom(userSettingsAtom);
}
```

## api-keys atom: adding keys manually for testing

Need to quickly add an API key for testing? Open your browser's console (F12) and run the following code to add API keys to local storage:

```typescript
localStorage.setItem(
  "analog-api-keys",
  JSON.stringify({
    openai: "sk-YOUR_OPENAI_KEY_HERE",
    // resend: "xxxxx",
  }),
);
```

After running this code, refresh the page to pick up the new API keys.
