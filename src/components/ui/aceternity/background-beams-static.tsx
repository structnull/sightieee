"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeamsStatic = ({
  className,
}: {
  className?: string;
}) => {
  const [gradientProps, setGradientProps] = useState({ cx: '50%', cy: '50%', r: '0%' });

  useEffect(() => {
    // Run only on the client
    const randomX = `${Math.random() * 100}%`;
    const randomY = `${Math.random() * 100}%`;
    const randomR = `${Math.floor(Math.random() * 41) + 40}%`; // From 40% to 80%

    setGradientProps({
        cx: randomX,
        cy: randomY,
        r: randomR
    });
  }, []);

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
            <radialGradient
              id="static-grad"
              cx={gradientProps.cx}
              cy={gradientProps.cy}
              r={gradientProps.r}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="hsl(var(--primary) / 0.2)" offset="0%" />
              <stop stopColor="hsl(var(--primary) / 0)" offset="100%" />
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#static-grad)" />
        </svg>
      </div>
    </div>
  );
};