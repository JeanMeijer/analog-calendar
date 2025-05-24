"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTRPC } from "@/lib/trpc/client";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email(),
});

type FormSchema = z.infer<typeof formSchema>;

function useWaitlistCount() {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const query = useQuery(trpc.earlyAccess.getWaitlistCount.queryOptions());

  const [success, setSuccess] = useState(false);

  const { mutate } = useMutation(
    trpc.earlyAccess.joinWaitlist.mutationOptions({
      onSuccess: (data) => {
        setSuccess(true);

        toast.success(data.message);

        queryClient.setQueryData(
          [trpc.earlyAccess.getWaitlistCount.queryKey()],
          {
            count: (query.data?.count ?? 0) + 1,
          }
        );
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
    })
  );

  return { count: query.data?.count ?? 0, mutate, success };
}

interface WaitlistFormProps {
  className?: string;
}

export function WaitlistForm({ className }: WaitlistFormProps) {
  const { register, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const waitlist = useWaitlistCount();

  function joinWaitlist({ email }: FormSchema) {
    waitlist.mutate({ email });
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-6 items-center justify-center w-full max-w-3xl mx-auto",
        className
      )}
    >
      {waitlist.success ? (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-xl font-semibold">
            You&apos;re on the waitlist! 🎉
          </p>
          <p className="text-base text-muted-foreground">
            We&apos;ll let you know when we&#39;re ready to show you what
            we&#39;ve been working on.
          </p>
        </div>
      ) : (
        <form
          className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mx-auto"
          onSubmit={handleSubmit(joinWaitlist)}
        >
          <Input
            placeholder="example@0.email"
            className="md:text-base text-base font-medium h-11 placeholder:text-muted-foreground placeholder:font-medium bg-white outline outline-neutral-200 w-full rounded-md px-4"
            {...register("email")}
          />
          <Button
            className="w-full sm:w-fit pl-4 pr-3 h-11 text-base"
            type="submit"
          >
            Join Waitlist <ChevronRight className="h-5 w-5" />
          </Button>
        </form>
      )}

      <div className="relative flex flex-row gap-2 items-center justify-center">
        <span className="bg-green-600 dark:bg-green-400 size-2 rounded-full" />
        <span className="bg-green-600 dark:bg-green-400 size-2 rounded-full blur-xs left-0 absolute" />
        <span className="text-green-600 dark:text-green-400 text-sm sm:text-base">
          <NumberFlow value={waitlist.count} /> people already joined
        </span>
      </div>
    </div>
  );
}
