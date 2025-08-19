"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Speed = "slow" | "fast";

type Props = {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number; // in px
  backgroundFill?: string; // hex or rgb(a)
  blur?: number; // in px
  speed?: Speed;
  waveOpacity?: number; // 0..1
  // Advanced tuning (optional):
  noiseScaleX?: number; // default ~700
  noiseAmplitude?: number; // default ~100
  waveSeparation?: number; // default ~0.3
  maxWaves?: number; // default 16 (shader constant); you can pass <= 16
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
  // supports #RGB, #RRGGBB, rgb(), rgba()
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
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const int = parseInt(h, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return [r / 255, g / 255, b / 255];
}

function getSpeedValue(speed: Speed | undefined) {
  switch (speed) {
    case "slow":
      return 0.001;
    case "fast":
      return 0.002;
    default:
      return 0.001;
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

// 3D simplex noise by Ashima Arts (public domain / MIT-licensed snippets)
const FS = `
precision mediump float;

varying vec2 v_uv;

uniform vec2  u_resolution;
uniform float u_time;
uniform float u_speed;
uniform float u_lineWidth;
uniform float u_opacity;
uniform vec3  u_bg;
uniform int   u_colorCount;
uniform vec3  u_colors[${MAX_WAVES_SHADER}];
uniform float u_scaleX;
uniform float u_amplitude;
uniform float u_waveSep;

//
// Simplex noise 3D
//
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0.0 + 0.0 * C
  //  x1 = x0 - i1  + 1.0 * C
  //  x2 = x0 - i2  + 2.0 * C
  //  x3 = x0 - 1.0 + 3.0 * C
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0 + 3.0 * C.x = -0.5 = -D.y

  // Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  float n_ = 1.0/7.0; // 1/7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j, N)

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

  // Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
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

  vec3 waveCol = vec3(0.0);

  // Anti-alias width
  float halfW = u_lineWidth * 0.5;
  float aa = 1.5 + 0.75 * (res.x / 1920.0); // slight scale-based AA

  // Center Y
  float yCenter = 0.5 * res.y;

  // Loop through waves (constant upper bound for WebGL1 compatibility)
  for (int i = 0; i < ${MAX_WAVES_SHADER}; i++) {
    if (i >= u_colorCount) break;

    float idx = float(i);
    float n = snoise(vec3(xPx / u_scaleX, u_waveSep * idx, t));
    float y0 = yCenter + n * u_amplitude;

    float d = abs(yPx - y0);

    // Soft stroke via smoothstep band
    float inside = smoothstep(halfW + aa, halfW - aa, d);

    waveCol += u_colors[i] * inside;
  }

  waveCol = clamp(waveCol, 0.0, 1.0);
  vec3 color = mix(u_bg, waveCol, clamp(u_opacity, 0.0, 1.0));

  gl_FragColor = vec4(color, 1.0);
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
  waveWidth = 50,
  backgroundFill = "#000000",
  blur = 12,
  speed = "fast",
  waveOpacity = 0.5,
  noiseScaleX = 700,
  noiseAmplitude = 100,
  waveSeparation = 0.3,
  maxWaves = 16,
  ...props
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    setIsSafari(ua.includes("Safari") && !ua.includes("Chrome"));
  }, []);

  const parsedBg = useMemo(() => hexToRgb01(backgroundFill), [backgroundFill]);

  const colorArray = useMemo(() => {
    const limit = Math.max(1, Math.min(maxWaves, MAX_WAVES_SHADER));
    const cols = colors.length ? colors : DEFAULT_COLORS;
    const count = Math.min(cols.length, limit);
    const out = new Float32Array(MAX_WAVES_SHADER * 3);
    for (let i = 0; i < count; i++) {
      const [r, g, b] = hexToRgb01(cols[i]);
      out[i * 3 + 0] = r;
      out[i * 3 + 1] = g;
      out[i * 3 + 2] = b;
    }
    return { data: out, count };
  }, [colors, maxWaves]);

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
      // WebGL not supported; silently no-op (or you could add a fallback)
      console.warn("WebGL not supported in this browser/device.");
      return;
    }

    // Setup program
    const program = createProgram(gl, VS, FS);
    gl.useProgram(program);

    // Full-screen quad (two triangles) using clip-space coords
    const buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const vertices = new Float32Array([
      -1, -1,
      3, -1,
      -1, 3,
    ]); // a single big triangle covering screen
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosLoc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uSpeed = gl.getUniformLocation(program, "u_speed");
    const uLineWidth = gl.getUniformLocation(program, "u_lineWidth");
    const uOpacity = gl.getUniformLocation(program, "u_opacity");
    const uBg = gl.getUniformLocation(program, "u_bg");
    const uColorCount = gl.getUniformLocation(program, "u_colorCount");
    const uColors0 = gl.getUniformLocation(program, "u_colors[0]");
    const uScaleX = gl.getUniformLocation(program, "u_scaleX");
    const uAmplitude = gl.getUniformLocation(program, "u_amplitude");
    const uWaveSep = gl.getUniformLocation(program, "u_waveSep");

    // Static uniforms
    gl.uniform1f(uSpeed, getSpeedValue(speed));
    gl.uniform1f(uLineWidth, waveWidth);
    gl.uniform1f(uOpacity, waveOpacity);
    gl.uniform3f(uBg, parsedBg[0], parsedBg[1], parsedBg[2]);
    gl.uniform1i(uColorCount, colorArray.count);
    if (uColors0) gl.uniform3fv(uColors0, colorArray.data);
    gl.uniform1f(uScaleX, noiseScaleX);
    gl.uniform1f(uAmplitude, noiseAmplitude);
    gl.uniform1f(uWaveSep, waveSeparation);

    // Resize handling with devicePixelRatio
    let width = 0,
      height = 0;
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // clamp for perf
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

    let raf = 0;
    const start = performance.now();

    const render = () => {
      const now = performance.now();
      const t = (now - start) / 1000.0; // seconds
      gl.uniform1f(uTime, t);

      // Draw
      // Clear to background (not strictly necessary since shader outputs every pixel)
      gl.clearColor(parsedBg[0], parsedBg[1], parsedBg[2], 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    // Respond to prop changes dynamically without recreating program
    // (Update uniforms that can change)
    const updateUniforms = () => {
      gl.useProgram(program);
      gl.uniform1f(uSpeed, getSpeedValue(speed));
      gl.uniform1f(uLineWidth, waveWidth);
      gl.uniform1f(uOpacity, waveOpacity);
      gl.uniform3f(uBg, parsedBg[0], parsedBg[1], parsedBg[2]);
      gl.uniform1i(uColorCount, colorArray.count);
      if (uColors0) gl.uniform3fv(uColors0, colorArray.data);
      gl.uniform1f(uScaleX, noiseScaleX);
      gl.uniform1f(uAmplitude, noiseAmplitude);
      gl.uniform1f(uWaveSep, waveSeparation);
    };
    updateUniforms();

    // Also update on window resize (viewport changes may occur outside container)
    const onWinResize = () => resize();
    window.addEventListener("resize", onWinResize);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", onWinResize);
      // Cleanup GL resources
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // Recreate pipeline only if shader-relevant structure changes:
    // (We keep program and just update uniforms for normal prop changes.)
    // Using a single effect keeps it straightforward.
    // eslint guarded
  ]);

  // Update dynamic uniforms on prop changes by flagging a "version" that triggers uniform updates in the effect above is complex;
  // simpler: run a lightweight effect to poke uniforms by re-running the main effect body update via dispatchEvent.
  // However, we already bound uniforms in the main effect using current props.
  // For significant runtime prop changes, remount this component or lift the GL state handling.

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full flex flex-col items-center justify-center overflow-hidden", containerClassName)}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 block"
        // Use CSS filter for blur (GPU-accelerated on major browsers, including Safari)
        style={{
          filter: `blur(${blur}px)`,
          // Safari sometimes benefits from its own composite hint; keep it simple
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
