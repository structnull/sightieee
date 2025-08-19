
"use client";

import { Button } from "../ui/button";
import { WavyBackground } from "../ui/aceternity/wavy-background";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  return (
    <section id="hero" className="w-full mx-auto h-[calc(100vh-5rem)] relative">
      <WavyBackground className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
        <motion.div
          initial="hidden"
          animate="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          className="flex flex-col items-center justify-center"
        >
          <motion.h1
            variants={FADE_UP_ANIMATION_VARIANTS}
            className="text-white font-headline text-4xl md:text-6xl lg:text-7xl font-bold text-center [text-shadow:0_2px_8px_rgba(0,0,0,0.5)]"
          >
            Technology for Humanity
          </motion.h1>
          <motion.p
            variants={FADE_UP_ANIMATION_VARIANTS}
            className="text-white text-sm md:text-lg max-w-xl mt-6 text-center [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]"
          >
            IEEE SIGHT SB CEK: Leveraging engineering and technology to address local challenges and build a sustainable future for our community.
          </motion.p>
          <motion.div
            variants={FADE_UP_ANIMATION_VARIANTS}
            className="flex flex-col sm:flex-row items-center gap-4 mt-8"
          >
              <Link href="#about">
                  <Button
                    size="lg"
                    className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 hover:bg-white/90 dark:hover:bg-slate-800"
                  >
                    Explore Our Impact
                    <ArrowDown className="ml-2 h-5 w-5"/>
                  </Button>
              </Link>
          </motion.div>
        </motion.div>
      </WavyBackground>
    </section>
  );
}
