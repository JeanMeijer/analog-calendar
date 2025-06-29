import { Discord, GitHub, Logo, Twitter } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  return (
    <header className="bg-landing-background/80 fixed top-0 right-0 left-0 z-50 flex w-full flex-row border-b border-border/10 px-4 py-4 backdrop-blur-md sm:px-6 sm:py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-row items-center justify-between">
        <Logo />

        <nav className="flex flex-row items-center justify-center gap-1.5">
          <Button asChild variant="ghost" size="sm">
            <a
              href="https://github.com/jeanmeijer/analog"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHub className="fill-primary" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>

          <Button asChild variant="ghost" size="sm">
            <a
              href="https://x.com/analogdotnow"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="fill-primary" />
              <span className="sr-only">Twitter</span>
            </a>
          </Button>

          <Button asChild variant="ghost" size="sm">
            <a
              href="https://discord.gg/K3AsABDKUm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Discord className="fill-primary" />
              <span className="sr-only">Discord</span>
            </a>
          </Button>

          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
