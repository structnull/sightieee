"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function AnimatedGradientBackground({
  children,
  className,
  containerClassName,
  ...props
}: AnimatedGradientBackgroundProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden",
        containerClassName
      )}
      {...props}
    >
      {/* Dynamic gradient background with multiple layers */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        
        {/* Animated gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-yellow-500/10 animate-gradient-xy"></div>
        
        {/* Floating gradient orbs with improved positioning */}
        <div className="absolute top-1/4 -left-12 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-600/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-1/3 -right-12 w-96 h-96 bg-gradient-to-r from-yellow-400/30 to-pink-600/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-12 left-1/3 w-96 h-96 bg-gradient-to-r from-pink-400/30 to-cyan-600/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        
        {/* Moving mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
        
        {/* Subtle animated wave effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-wave-slow"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-wave-fast"></div>
        </div>
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-20 bg-noise-pattern"></div>
      </div>
      
      {/* Content */}
      <div className={cn("relative z-10", className)}>
        {children}
      </div>
      
      {/* Enhanced floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute rounded-full bg-white/20",
              i % 3 === 0 ? "w-1 h-1" : i % 3 === 1 ? "w-0.5 h-0.5" : "w-2 h-2",
              "animate-float-up"
            )}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>
      
      {/* Glowing stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}