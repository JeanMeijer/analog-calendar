import { useState } from "react";
import { useUpdateEffect } from "@react-hookz/web";
import { Users } from "lucide-react";

import { AsyncSelect } from "@/components/ui/async-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Participant } from "@/lib/schemas/event-form";
import { cn } from "@/lib/utils";
import {
  getUsersFromParticipants,
  searchUsers,
  type User,
} from "../support/users";

interface ParticipantsFieldProps {
  value: Participant[];
  onChange: (value: Participant[]) => void;
  isInvalid?: boolean;
}

const Participants = ({
  value,
  onChange,
  isInvalid,
}: ParticipantsFieldProps) => {
  const [participants, setParticipants] = useState<User[]>(
    getUsersFromParticipants(value),
  );

  const handleChange = (participants: User[]) => {
    setParticipants(participants);
    onChange(participants);
  };

  useUpdateEffect(() => {
    if (value.length === 0) {
      setParticipants([]);
    }
  }, [value]);

  return (
    <div className="flex items-center gap-x-3">
      <Users className="size-4 text-muted-foreground/80" />
      <div className="flex-1">
        <AsyncSelect<User>
          label="Users"
          placeholder="No participants"
          searchPlaceholder="Search users or enter email..."
          noResultsMessage="No users found"
          triggerClassName="shadow-none border-none !bg-transparent hover:bg-transparent h-6 !p-0.5 aria-invalid:text-destructive"
          getDisplayValue={SelectedParticipants}
          renderOption={ParticipantOption}
          getOptionValue={(user) => user.id}
          value={participants}
          onChange={handleChange}
          fetcher={searchUsers}
          isInvalid={isInvalid}
          popoverContentProps={{
            align: "end",
            alignOffset: -1,
            side: "bottom",
            sideOffset: 6,
          }}
          multiple
        />
      </div>
    </div>
  );
};

function ParticipantOption(user: User) {
  const primaryText = user.name ?? user.email;
  const secondaryText = user.name ? user.email : undefined;
  const defaultInitials = primaryText.charAt(0).toUpperCase();
  const initials = user.initials ?? defaultInitials;

  return (
    <div className="flex items-center gap-3 px-2">
      <Avatar className="size-6">
        <AvatarImage src={user.avatarUrl} alt={`${user.name} avatar`} />
        <AvatarFallback
          className={cn(
            "bg-ring/40 text-[0.7rem]",
            initials.length === 1 && "text-sm",
          )}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div
          className={cn(
            "text-sm leading-loose font-medium",
            secondaryText && "leading-none",
          )}
        >
          {primaryText}
        </div>
        {secondaryText && (
          <div className="text-xs leading-tight text-muted-foreground">
            {secondaryText}
          </div>
        )}
      </div>
    </div>
  );
}

function SelectedParticipants(participants: User[]) {
  if (participants.length === 0) return null;

  const sorted = [...participants].sort((a, b) => {
    if (a.name && b.name) {
      return a.name.length - b.name.length;
    }
    return a.email.length - b.email.length;
  });
  const displayText = sorted
    .slice(0, 2)
    .map((p) => p.name ?? p.email)
    .join(", ");

  return (
    <span className="inline-flex items-center text-sm font-medium">
      <span className="max-w-48 truncate">{displayText}</span>
      {sorted.length > 2 && (
        <span className="ml-2 rounded-full bg-muted-foreground/10 px-2 py-0.5 font-mono text-xs font-normal">
          +{sorted.length - 2}
        </span>
      )}
    </span>
  );
}

export default Participants;
