import Image from "next/image";
import { Variants } from "motion/react";

import PreviewDark from "@/assets/dark-preview.png";
import PreviewLight from "@/assets/preview.png";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { HydrateClient, prefetch, trpc } from "@/lib/trpc/server";
import { WaitlistForm } from "./waitlist-form";

// import { CalendarWindow } from "./calendar-window";
// import { cn } from "@/lib/utils";

const transitionVariants: Record<string, Variants> = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export function Hero() {
  prefetch(trpc.earlyAccess.getWaitlistCount.queryOptions());

  return (
    <div className="flex w-full max-w-6xl flex-col gap-12 overflow-hidden md:gap-16">
      <AnimatedGroup variants={transitionVariants}>
        <div className="flex flex-col gap-12 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-3 text-center md:gap-6">
            <h1 className="font-satoshi text-4xl leading-tight md:text-5xl lg:text-6xl">
              Beyond Scheduling. <br /> A calendar that understands your life.
            </h1>
            <p className="max-w-xl text-base text-muted-foreground md:text-lg">
              Analog is an open-source alternative that turns intentions into
              actions.
            </p>
          </div>

          <HydrateClient>
            <WaitlistForm />
          </HydrateClient>
        </div>
      </AnimatedGroup>

      <AnimatedGroup
        variants={{
          container: {
            visible: {
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.25,
              },
            },
          },
          ...transitionVariants,
        }}
      >
        <div className="mx-auto w-full min-w-[300vw] px-4 sm:max-w-7xl sm:min-w-0 sm:translate-x-0 sm:px-6">
          {/* <div className="w-full [--base-height:874px] [--display-height:calc(var(--base-height)_*_var(--preview-scale))] [--preview-scale:0.5] sm:[--preview-scale:0.8]">
            <div className="[--item-width:1400px]">
              <CalendarWindow className="h-(--base-height) w-(--item-width) scale-(--preview-scale) origin-top-left" />
            </div>
          </div>
          <CalendarWindow className="w-full h-[50vh]" /> */}
          <Image
            src={PreviewDark}
            alt="Hero"
            className="hidden rounded-lg dark:block"
            unoptimized
          />
          <Image
            src={PreviewLight}
            alt="Hero"
            className="block rounded-lg dark:hidden"
            unoptimized
          />
        </div>
      </AnimatedGroup>
    </div>
  );
}
