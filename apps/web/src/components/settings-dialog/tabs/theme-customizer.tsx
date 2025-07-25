"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { editableTokens } from "@/lib/themeTokenConfig";

const tokenGroups = {
  Sidebar: ["--sidebar", "--sidebar-accent"],
  Dashboard: ["--background", "--accent"],
};

export function ThemeCustomizer() {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("custom-theme");
    if (stored) {
      const parsed = JSON.parse(stored);
      setColors(parsed);
      for (const token in parsed) {
        document.documentElement.style.setProperty(token, parsed[token]);
      }
    }
  }, []);
  const getEffectiveColor = (token: string) => {
    return (
      colors[token] ||
      editableTokens.find((t) => t.token === token)?.default ||
      "#000000"
    );
  };

  const updateToken = (token: string, value: string) => {
    const updated = { ...colors, [token]: value };
    setColors(updated);
    document.documentElement.style.setProperty(token, value);
  };

  const resetTheme = () => {
    editableTokens.forEach(({ token }) => {
      document.documentElement.style.removeProperty(token);
    });
    localStorage.removeItem("custom-theme");
    setColors({});
    // todo: Add toast notification for reset
  };

  const confirmSaveTheme = () => {
    localStorage.setItem("custom-theme", JSON.stringify(colors));
    setShowDialog(false);
    // todo : Add toast notification for save confirmation
  };

  const isModified = (token: string) => {
    const current = colors[token];
    const def = editableTokens.find((t) => t.token === token)?.default;
    return current && current !== def;
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="font-semibold">Customize Theme</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Personalize your color scheme
        </p>
      </div>

      <div className="max-h-96 space-y-6 overflow-y-auto pr-2">
        {Object.entries(tokenGroups).map(([groupName, groupTokens]) => (
          <div key={groupName} className="space-y-3">
            <h3 className="text-base font-medium text-foreground">
              {groupName} Colors
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {groupTokens.map((token) => {
                const label =
                  editableTokens.find((t) => t.token === token)?.label || token;
                return (
                  <div
                    key={token}
                    className="space-y-2 rounded-lg border bg-card p-3 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <label className="font-medium text-foreground">
                          {label}
                        </label>
                        <p className="font-mono text-muted-foreground">
                          {token}
                        </p>
                      </div>
                      {isModified(token) && (
                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold text-yellow-700">
                          Modified
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={getEffectiveColor(token)}
                        onChange={(e) => updateToken(token, e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded-md border border-muted"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate rounded border bg-muted/50 px-2 py-1 font-mono">
                          {getEffectiveColor(token)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button variant="outline" onClick={resetTheme} size="sm">
          Reset
        </Button>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button size="sm">Save Theme</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Save Theme</DialogTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Are you sure you want to save this custom theme?
              </p>
            </DialogHeader>
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button onClick={confirmSaveTheme}>Confirm Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
