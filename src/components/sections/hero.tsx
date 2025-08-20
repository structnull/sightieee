
"use client";

import { Button } from "../ui/button";
import { AnimatedGradientBackground } from "../ui/animated-gradient-background";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 300
      } 
    },
  };

  return (
    <section id="hero" className="w-full mx-auto h-[calc(100vh-5rem)] relative">
      <AnimatedGradientBackground className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
        <motion.div
          initial="hidden"
          animate="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="flex flex-col items-center justify-center"
        >
          <motion.h1
            variants={FADE_UP_ANIMATION_VARIANTS}
            className="text-white font-headline text-4xl md:text-6xl lg:text-7xl font-bold text-center [text-shadow:0_4px_16px_rgba(0,0,0,0.6)] bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-pulse-glow"
          >
            Technology for Humanity
          </motion.h1>
          <motion.p
            variants={FADE_UP_ANIMATION_VARIANTS}
            className="text-white/90 text-sm md:text-lg max-w-xl mt-6 text-center [text-shadow:0_2px_8px_rgba(0,0,0,0.5)]"
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
                    className="bg-white/95 backdrop-blur-sm dark:bg-slate-900/95 text-black dark:text-white border-white/20 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Explore Our Impact
                    <ArrowDown className="ml-2 h-5 w-5 animate-bounce"/>
                  </Button>
              </Link>
          </motion.div>
        </motion.div>
      </AnimatedGradientBackground>
    </section>
  );
}
