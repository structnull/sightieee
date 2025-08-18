"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

class VortexEffect {
  private el: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particle_count: number;
  private particle_trace_length: number;
  private particle_speed: number;
  private particles: any[];
  private range: number;
  private h: number;
  private w: number;
  private TWO_PI: number;
  private base_hue: number;
  private base_speed: number;
  private range_speed: number;
  private base_size: number;
  private range_size: number;

  constructor(el: HTMLCanvasElement, options: any) {
    this.el = el;
    this.ctx = el.getContext("2d") as CanvasRenderingContext2D;

    this.particle_count = options.particleCount || 700;
    this.particle_trace_length = options.particleTraceLength || 0.7;
    this.particle_speed = options.particleSpeed || 1.1;

    this.particles = [];
    this.range = options.range || 100;
    this.h = this.el.height;
    this.w = this.el.width;

    this.TWO_PI = 2 * Math.PI;

    this.base_hue = options.baseHue || 220;
    this.base_speed = options.baseSpeed || 0.01;
    this.range_speed = options.rangeSpeed || 1;
    this.base_size = options.baseSize || 1;
    this.range_size = options.rangeSize || 1.5;

    this.init();
  }

  init() {
    this.w = this.el.width = window.innerWidth;
    this.h = this.el.height = window.innerHeight;
    this.ctx.fillStyle = "rgba(0,0,0,0)";
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.spawn_particles();
    this.draw();
  }

  spawn_particles() {
    for (var i = 0; i < this.particle_count; i++) {
      this.particles[i] = this.particle();
    }
  }

  particle() {
    var x = this.w / 2 + (Math.random() - 0.5) * this.range;
    var y = this.h / 2 + (Math.random() - 0.5) * this.range;
    var s = this.base_speed + Math.random() * this.range_speed;
    var a = Math.random() * this.TWO_PI;
    var size = this.base_size + Math.random() * this.range_size;
    return { x, y, s, a, size };
  }

  draw() {
    this.ctx.fillStyle = `rgba(0,0,0,${1 - this.particle_trace_length})`;
    this.ctx.fillRect(0, 0, this.w, this.h);
    for (var i = 0; i < this.particle_count; i++) {
      this.draw_particle(this.particles[i]);
    }
    window.requestAnimationFrame(() => this.draw());
  }

  draw_particle(p: any) {
    this.ctx.fillStyle = `hsla(${
      this.base_hue + (p.x / this.w - 0.5) * 40
    }, 80%, 50%, 0.8)`;
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.size, 0, this.TWO_PI);
    this.ctx.fill();
    this.update_particle(p);
  }

  update_particle(p: any) {
    p.a += p.s;
    p.x += Math.cos(p.a) * this.particle_speed;
    p.y += Math.sin(p.a) * this.particle_speed;

    if (p.x < 0 || p.x > this.w || p.y < 0 || p.y > this.h) {
      this.particles[this.particles.indexOf(p)] = this.particle();
    }
  }
}

export const Vortex = ({
  children,
  className,
  particleCount = 700,
  particleTraceLength = 0.7,
  particleSpeed = 1.1,
  range = 250,
  baseHue = 208,
  baseSpeed = 0,
  rangeSpeed = 2,
  baseSize = 1,
  rangeSize = 2,
}: {
  children?: React.ReactNode;
  className?: string;
  particleCount?: number;
  particleTraceLength?: number;
  particleSpeed?: number;
  range?: number;
  baseHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseSize?: number;
  rangeSize?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const vortex = new VortexEffect(canvas, {
        particleCount,
        particleTraceLength,
        particleSpeed,
        range,
        baseHue,
        baseSpeed,
        rangeSpeed,
        baseSize,
        rangeSize,
      });

      const handleResize = () => {
        vortex.init();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [
    particleCount,
    particleTraceLength,
    particleSpeed,
    range,
    baseHue,
    baseSpeed,
    rangeSpeed,
    baseSize,
    rangeSize,
  ]);
  return (
    <div className={cn("relative h-full w-full", className)}>
      <canvas
        ref={canvasRef}
        className="absolute h-full w-full inset-0"
      ></canvas>

      {children}
    </div>
  );
};
