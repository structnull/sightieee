"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-full h-full -z-10",
        className
      )}
    >
      <div className="absolute inset-0 bg-background"></div>
      <div className="absolute inset-0 bg-grid-slate-100/[0.05] dark:bg-grid-slate-900/[0.1] bg-[size:32px_32px]"></div>
      
      <div className="absolute inset-0 overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <motion.radialGradient
              id="grad"
              cx="50%"
              cy="50%"
              r="50%"
              initial={{ r: "0%" }}
              animate={{ r: "50%" }}
              transition={{ duration: 4, ease: "linear", repeat: Infinity }}
            >
              <stop stopColor="hsl(var(--primary) / 0.2)" offset="0%" />
              <stop stopColor="hsl(var(--primary) / 0)" offset="100%" />
            </motion.radialGradient>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
        </svg>
      </div>
    </div>
  );
};
