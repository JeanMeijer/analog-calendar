import { Logo } from "@/components/icons";

export function Footer() {
  return (
    <footer className="flex w-full flex-row px-4 py-10 sm:px-6 sm:py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-row items-center justify-between">
        <Logo className="opacity-50" />

        <div className="flex flex-row items-center justify-center gap-2 text-muted-foreground">
          {/*<Link*/}
          {/*  href="/terms"*/}
          {/*  className="underline underline-offset-2 text-xs md:text-sm"*/}
          {/*>*/}
          {/*  Terms of Use*/}
          {/*</Link>*/}
          {/*<Link*/}
          {/*  href="/privacy"*/}
          {/*  className="underline underline-offset-2 text-xs md:text-sm"*/}
          {/*>*/}
          {/*  Privacy Policy*/}
          {/*</Link>*/}

          {/* <ModeToggle /> */}
        </div>
      </div>
    </footer>
  );
}
