import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/sections/home/hero";

// Required for tRPC prefetching
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="bg-landing-background mx-auto w-full">
      <Header />
      <div className="min-h-[calc(100vh-8rem)] py-20 sm:py-28 md:py-32 lg:py-40">
        <main className="flex w-full flex-col items-center justify-center gap-8 md:gap-12">
          <Hero />
        </main>
      </div>
      <Footer />
    </div>
  );
}
