import { Button } from "../ui/button";
import { WavyBackground } from "../ui/aceternity/wavy-background";
import { ArrowDown } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section id="hero" className="w-full mx-auto h-[calc(100vh-5rem)] relative">
      <WavyBackground className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
        <h1 className="text-white font-headline text-4xl md:text-6xl lg:text-7xl font-bold text-center">
          Technology for Humanity
        </h1>
        <p className="text-white/80 text-sm md:text-lg max-w-xl mt-6 text-center">
          IEEE SIGHT SB CEK: Leveraging engineering and technology to address local challenges and build a sustainable future for our community.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
            <Link href="#about">
                <Button
                  size="lg"
                  className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 hover:bg-white/90 dark:hover:bg-slate-800"
                >
                  Explore Our Impact
                  <ArrowDown className="ml-2 h-5 w-5"/>
                </Button>
            </Link>
        </div>
      </WavyBackground>
    </section>
  );
}
