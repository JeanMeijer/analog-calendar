import { useState } from "react";
import { Settings, SlidersVertical, UsersRound, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accounts } from "./tabs/accounts";
import { General } from "./tabs/general";

// import { Notifications } from "./tabs/notifications";

const tabs = {
  accounts: {
    title: "Accounts",
    icon: UsersRound,
    component: Accounts,
  },
  general: {
    title: "General",
    icon: SlidersVertical,
    component: General,
  },
  // notifications: {
  //   title: "Notifications",
  //   icon: Bell,
  //   component: Notifications,
  // },
};

interface SettingsDialogProps {
  children?: React.ReactNode;
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);

  // Default trigger if no children provided
  const trigger = children ?? (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
      <Settings />
      Settings
    </DropdownMenuItem>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="w-full rounded-2xl p-0 sm:max-w-3xl"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <div className="relative flex gap-3 rounded-2xl bg-background px-5 py-4">
          <Tabs
            defaultValue="accounts"
            orientation="vertical"
            className="flex h-full w-full flex-row gap-3"
          >
            <TabsList className="w-48 shrink-0 flex-col justify-start gap-1 bg-transparent py-0">
              {Object.entries(tabs).map(([key, value]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="w-full justify-start data-[state=active]:bg-muted data-[state=active]:shadow-none"
                >
                  <value.icon className="mr-4 size-4" /> {value.title}
                </TabsTrigger>
              ))}
            </TabsList>
            <Separator
              orientation="vertical"
              className="bg-transparent bg-[linear-gradient(to_bottom_in_oklab,transparent_0%,var(--border)_15%,var(--border)_85%,transparent_100%)]"
            />
            <div className="flex-1 px-3 text-start">
              <div className="h-[32rem] w-full overflow-auto">
                {Object.entries(tabs).map(([key, value]) => (
                  <TabsContent key={key} value={key} className="mt-0 h-full">
                    <value.component />
                  </TabsContent>
                ))}
              </div>
            </div>
          </Tabs>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-3 size-7 hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
