"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Speed = "slow" | "fast";

type Props = {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waves?: number; // number of waves to draw (defaults to 8 )
  waveWidth?: number; // px thickness of each wave band
  backgroundFill?: string; // hex or rgb(a)
  blur?: number; // px
  speed?: Speed;
  waveOpacity?: number; // 0..1 final mix to bg
  // Advanced tuning:
  noiseScaleX?: number; // default ~700
  noiseAmplitude?: number; // default ~100
  waveSeparation?: number; // default ~0.3
  maxWaves?: number; // <= 16 (shader constant)
} & React.HTMLAttributes<HTMLDivElement>;

const DEFAULT_COLORS = [
  "#38bdf8",
  "#818cf8",
  "#c084fc",
  "#e879f9",
  "#22d3ee",
  "#f472b6",
  "#fb923c",
  "#facc15",
];

const MAX_WAVES_SHADER = 16; // MUST match shader constant

function hexToRgb01(hex: string): [number, number, number] {
  if (!hex) return [1, 1, 1];
  const trimmed = hex.trim();
  if (trimmed.startsWith("rgb")) {
    const nums = trimmed
      .replace(/[rgba()\s]/g, "")
      .split(",")
      .slice(0, 3)
      .map((n) => Math.max(0, Math.min(255, parseFloat(n))));
    return [nums[0] / 255, nums[1] / 255, nums[2] / 255];
  }
  let h = trimmed.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const int = parseInt(h, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return [r / 255, g / 255, b / 255];
}

// Match original per-frame speed perception (~0.001 and ~0.002 per frame at 60fps)
function getSpeedPerSecond(speed: Speed | undefined) {
  switch (speed) {
    case "slow":
      return 0.06; // ~0.001 * 60
    case "fast":
      return 0.24; // ~0.002 * 60
    default:
      return 0.06;
  }
}

const VS = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

// Fragment shader with highp fallback and overlay-style blending
const FS = `
#ifdef GL_ES
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    precision highp int;
  #else
    precision mediump float;
    precision mediump int;
  #endif
#else
  precision highp float;
  precision highp int;
#endif

varying vec2 v_uv;

uniform vec2  u_resolution;
uniform float u_time;     // seconds
uniform float u_speed;    // per-second phase speed
uniform float u_lineWidth;
uniform float u_opacity;
uniform vec3  u_bg;
uniform int   u_waveCount;
uniform vec3  u_colors[${MAX_WAVES_SHADER}];
uniform float u_scaleX;
uniform float u_amplitude;
uniform float u_waveSep;

// Simplex noise 3D (Ashima)
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1),
                          dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  vec2 res = u_resolution;
  float xPx = v_uv.x * res.x;
  float yPx = v_uv.y * res.y;

  float t = u_time * u_speed;
  float halfW = u_lineWidth * 0.5;
  float aa = 1.5 + 0.75 * (res.x / 1920.0);
  float yCenter = 0.5 * res.y;

  // Overlay-style compositing to avoid additive whitening
  vec3 col = u_bg;

  for (int i = 0; i < ${MAX_WAVES_SHADER}; i++) {
    if (i >= u_waveCount) break;

    float idx = float(i);
    float n = snoise(vec3(xPx / u_scaleX, u_waveSep * idx, t));
    float y0 = yCenter + n * u_amplitude;
    float d = abs(yPx - y0);
    float inside = smoothstep(halfW + aa, halfW - aa, d);

    vec3 waveColor = u_colors[i];
    col = mix(col, waveColor, inside);
  }

  vec3 finalCol = mix(u_bg, col, clamp(u_opacity, 0.0, 1.0));
  gl_FragColor = vec4(finalCol, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) || "Unknown shader compile error";
    gl.deleteShader(shader);
    throw new Error(info);
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vsSrc: string, fsSrc: string) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSrc);
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program) || "Unknown program link error";
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    throw new Error(info);
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return program;
}

export function WavyBackground({
  children,
  className,
  containerClassName,
  colors = DEFAULT_COLORS,
  waves = 8,
  waveWidth = 100,
  backgroundFill = "#000000",
  blur = 12,
  speed = "fast",
  waveOpacity = 0.7,
  noiseScaleX = 700,
  noiseAmplitude = 100,
  waveSeparation = 0.3,
  maxWaves = 16,
  ...props
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isSafari] = useState(() => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    return ua.includes("Safari") && !ua.includes("Chrome");
  });

  const parsedBg = useMemo(() => hexToRgb01(backgroundFill), [backgroundFill]);

  // Build a repeated color list to match "waves" count
  const colorsForWaves = useMemo(() => {
    const limit = Math.max(1, Math.min(maxWaves, MAX_WAVES_SHADER));
    const waveCount = Math.max(1, Math.min(waves, limit));
    const palette = colors.length ? colors : DEFAULT_COLORS;

    const out = new Float32Array(MAX_WAVES_SHADER * 3);
    for (let i = 0; i < waveCount; i++) {
      const [r, g, b] = hexToRgb01(palette[i % palette.length]);
      out[i * 3 + 0] = r;
      out[i * 3 + 1] = g;
      out[i * 3 + 2] = b;
    }
    return { data: out, count: waveCount };
  }, [colors, waves, maxWaves]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl =
      (canvas.getContext("webgl", {
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
      }) as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      console.warn("WebGL not supported in this browser/device.");
      return;
    }

    const program = createProgram(gl, VS, FS);
    gl.useProgram(program);

    // Big-triangle covering viewport
    const buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPosLoc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uSpeed = gl.getUniformLocation(program, "u_speed");
    const uLineWidth = gl.getUniformLocation(program, "u_lineWidth");
    const uOpacity = gl.getUniformLocation(program, "u_opacity");
    const uBg = gl.getUniformLocation(program, "u_bg");
    const uWaveCount = gl.getUniformLocation(program, "u_waveCount");
    const uColors0 = gl.getUniformLocation(program, "u_colors[0]");
    const uScaleX = gl.getUniformLocation(program, "u_scaleX");
    const uAmplitude = gl.getUniformLocation(program, "u_amplitude");
    const uWaveSep = gl.getUniformLocation(program, "u_waveSep");

    // Static-like uniforms at mount, and re-applied below on prop changes
    const applyUniforms = () => {
      gl.useProgram(program);
      gl.uniform1f(uSpeed, getSpeedPerSecond(speed));
      gl.uniform1f(uLineWidth, waveWidth);
      gl.uniform1f(uOpacity, waveOpacity);
      gl.uniform3f(uBg, parsedBg[0], parsedBg[1], parsedBg[2]);
      gl.uniform1i(uWaveCount, colorsForWaves.count);
      if (uColors0) gl.uniform3fv(uColors0, colorsForWaves.data);
      gl.uniform1f(uScaleX, noiseScaleX);
      gl.uniform1f(uAmplitude, noiseAmplitude);
      gl.uniform1f(uWaveSep, waveSeparation);
    };
    applyUniforms();

    // Resize handling with DPR
    let width = 0,
      height = 0;
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap for perf
      const newW = Math.max(1, Math.floor(rect.width * dpr));
      const newH = Math.max(1, Math.floor(rect.height * dpr));
      if (newW !== width || newH !== height) {
        width = newW;
        height = newH;
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${Math.max(1, Math.floor(rect.width))}px`;
        canvas.style.height = `${Math.max(1, Math.floor(rect.height))}px`;
        gl.viewport(0, 0, width, height);
        gl.uniform2f(uResolution, width, height);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    const onWinResize = () => resize();
    window.addEventListener("resize", onWinResize);

    let raf = 0;
    const start = performance.now();

    const render = () => {
      const now = performance.now();
      const tSec = (now - start) / 1000.0;
      gl.uniform1f(uTime, tSec);

      gl.clearColor(parsedBg[0], parsedBg[1], parsedBg[2], 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    // Re-apply uniforms if relevant props change while mounted
    const cleanupReapply = () => applyUniforms();

    // Simple observers for prop changes:
    // We rely on React re-running this effect if dependencies change.
    // No-op here, but keeping function for clarity.

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", onWinResize);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // Recreate GL pipeline when these change materially
    backgroundFill,
    colorsForWaves.count,
    // colors array content affects colorsForWaves.data identity -> safe to include waves/speed/others in below uniform pass
    waves,
    maxWaves,
  ]);

  // Lightweight effect to update uniforms on prop changes without recreating the pipeline
  useEffect(() => {
    const canvas = canvasRef.current;
    const gl =
      (canvas?.getContext("webgl") as WebGLRenderingContext | null) ||
      (canvas?.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    // After program creation, WebGL's current program persists; get it
    const program = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram | null;
    if (!program) return;

    gl.useProgram(program);
    const uSpeed = gl.getUniformLocation(program, "u_speed");
    const uLineWidth = gl.getUniformLocation(program, "u_lineWidth");
    const uOpacity = gl.getUniformLocation(program, "u_opacity");
    const uBg = gl.getUniformLocation(program, "u_bg");
    const uWaveCount = gl.getUniformLocation(program, "u_waveCount");
    const uColors0 = gl.getUniformLocation(program, "u_colors[0]");
    const uScaleX = gl.getUniformLocation(program, "u_scaleX");
    const uAmplitude = gl.getUniformLocation(program, "u_amplitude");
    const uWaveSep = gl.getUniformLocation(program, "u_waveSep");

    const [br, bg, bb] = hexToRgb01(backgroundFill);
    gl.uniform1f(uSpeed, getSpeedPerSecond(speed));
    gl.uniform1f(uLineWidth, waveWidth);
    gl.uniform1f(uOpacity, waveOpacity);
    gl.uniform3f(uBg, br, bg, bb);
    gl.uniform1i(uWaveCount, Math.max(1, Math.min(waves, MAX_WAVES_SHADER)));
    if (uColors0) {
      // Rebuild repeated color buffer to match current waves
      const limit = Math.max(1, Math.min(waves, MAX_WAVES_SHADER));
      const palette = (colors && colors.length ? colors : DEFAULT_COLORS).slice();
      const buf = new Float32Array(MAX_WAVES_SHADER * 3);
      for (let i = 0; i < limit; i++) {
        const [r, g, b] = hexToRgb01(palette[i % palette.length]);
        buf[i * 3 + 0] = r;
        buf[i * 3 + 1] = g;
        buf[i * 3 + 2] = b;
      }
      gl.uniform3fv(uColors0, buf);
    }
    gl.uniform1f(uScaleX, noiseScaleX);
    gl.uniform1f(uAmplitude, noiseAmplitude);
    gl.uniform1f(uWaveSep, waveSeparation);
  }, [
    backgroundFill,
    colors,
    waves,
    waveWidth,
    waveOpacity,
    noiseScaleX,
    noiseAmplitude,
    waveSeparation,
    speed,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full flex flex-col items-center justify-center overflow-hidden",
        containerClassName
      )}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 block"
        style={{
          filter: `blur(${blur}px)`,
          WebkitFilter: `blur(${blur}px)`,
          willChange: "transform",
        }}
      />
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
}
