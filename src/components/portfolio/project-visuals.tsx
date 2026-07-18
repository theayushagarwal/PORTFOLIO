import type { SVGProps } from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

/**
 * Frames a project visual like a dev tool window: a thin chrome bar with a
 * mono label (not macOS traffic lights — this is an engineering artifact,
 * not an app icon). No blur, no translucency — a flat surface with a border,
 * same as every other card on the site.
 */
export function DeviceFrame({
  label,
  className,
  children,
  noPadding = false,
  aspectClass = "aspect-[16/10]",
  fillHeight = false,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
  noPadding?: boolean;
  aspectClass?: string;
  fillHeight?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-surface",
        fillHeight && "flex flex-col h-full",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 shrink-0">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
        </div>
        <span className="font-mono text-[10px] tracking-wide text-subtle">{label}</span>
      </div>
      <div
        className={cn(
          "relative flex items-center justify-center w-full",
          fillHeight ? "flex-1 min-h-0" : aspectClass,
          noPadding ? "p-0" : "p-6",
        )}
      >
        {children}
      </div>
    </div>
  );
}

const svgBase: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 320 180",
  className: "h-full w-full",
  fill: "none",
};

/** Halcyon — step rail + streaming citations. */
export function AgentTraceVisual() {
  return (
    <svg {...svgBase} aria-hidden="true">
      <motion.line
        x1="24"
        y1="18"
        x2="24"
        y2="162"
        className="stroke-border"
        strokeWidth={1}
        variants={{
          hidden: { pathLength: 0 },
          visible: {
            pathLength: 1,
            transition: { duration: 0.8, ease: "easeOut" },
          },
        }}
      />
      {[18, 78, 138].map((y, i) => (
        <motion.circle
          key={y}
          cx="24"
          cy={y}
          r="4"
          className={i === 2 ? "fill-secondary" : "fill-subtle"}
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: {
              scale: 1,
              opacity: 1,
              transition: { delay: i * 0.15, duration: 0.3, type: "spring", stiffness: 200 },
            },
          }}
        />
      ))}
      {[
        { y: 24, w: 210 },
        { y: 84, w: 170 },
        { y: 144, w: 130 },
      ].map((row, i) => (
        <motion.rect
          key={row.y}
          x="44"
          y={row.y}
          width={row.w}
          height="6"
          rx="3"
          className="fill-white/10"
          variants={{
            hidden: { scaleX: 0, originX: 0 },
            visible: {
              scaleX: 1,
              transition: { duration: 0.6, delay: i * 0.12 + 0.1, ease: "easeOut" },
            },
            hover: {
              fill: "rgba(255, 255, 255, 0.18)",
              x: 48,
              transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 },
            },
          }}
        />
      ))}
      <motion.rect
        x="44"
        y="38"
        width="150"
        height="4"
        rx="2"
        className="fill-white/[0.06]"
        variants={{
          hidden: { scaleX: 0, originX: 0 },
          visible: { scaleX: 1, transition: { duration: 0.5, delay: 0.25 } },
          hover: { x: 48, transition: { duration: 0.3, delay: 0.04 } },
        }}
      />
      <motion.rect
        x="44"
        y="98"
        width="120"
        height="4"
        rx="2"
        className="fill-white/[0.06]"
        variants={{
          hidden: { scaleX: 0, originX: 0 },
          visible: { scaleX: 1, transition: { duration: 0.5, delay: 0.37 } },
          hover: { x: 48, transition: { duration: 0.3, delay: 0.08 } },
        }}
      />
      <motion.rect
        x="44"
        y="158"
        width="90"
        height="4"
        rx="2"
        className="fill-white/[0.06]"
        variants={{
          hidden: { scaleX: 0, originX: 0 },
          visible: { scaleX: 1, transition: { duration: 0.5, delay: 0.49 } },
          hover: { x: 48, transition: { duration: 0.3, delay: 0.12 } },
        }}
      />
      {[44, 92, 132].map((x, i) => (
        <motion.rect
          key={x}
          x={x}
          y="168"
          width="34"
          height="10"
          rx="5"
          className="fill-secondary/10 stroke-secondary/30"
          strokeWidth={1}
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: {
              scale: 1,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.4 + i * 0.1,
              },
            },
            hover: {
              scale: 1.06,
              stroke: "rgba(6, 182, 212, 0.6)",
              fill: "rgba(6, 182, 212, 0.15)",
              transition: { duration: 0.2 },
            },
          }}
        />
      ))}
      <circle cx="150" cy="144" r="2.5" className="fill-secondary">
        <animate attributeName="opacity" values="1;0.2;1" dur="1.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/** Parity — eval rows with pass marks and a fill bar. */
export function TerminalEvalsVisual() {
  const rows = [0, 1, 2, 3, 4];
  return (
    <svg {...svgBase} aria-hidden="true">
      {rows.map((i) => {
        const y = 20 + i * 26;
        const pass = i !== 3;
        return (
          <g key={i}>
            <motion.circle
              cx="22"
              cy={y}
              r="6"
              className={pass ? "stroke-secondary" : "stroke-primary"}
              strokeWidth="1.4"
              variants={{
                hidden: { scale: 0, opacity: 0 },
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: { type: "spring", stiffness: 200, delay: i * 0.08 },
                },
              }}
            />
            {pass ? (
              <motion.path
                d={`M19 ${y} l2 2.5 l4 -5`}
                className="stroke-secondary"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={{
                  hidden: { pathLength: 0 },
                  visible: {
                    pathLength: 1,
                    transition: { duration: 0.25, delay: i * 0.08 + 0.2 },
                  },
                }}
              />
            ) : (
              <motion.path
                d={`M19.5 ${y - 2.5} l5 5 M24.5 ${y - 2.5} l-5 5`}
                className="stroke-primary"
                strokeWidth="1.4"
                strokeLinecap="round"
                variants={{
                  hidden: { pathLength: 0 },
                  visible: {
                    pathLength: 1,
                    transition: { duration: 0.25, delay: i * 0.08 + 0.2 },
                  },
                }}
              />
            )}
            <motion.rect
              x="42"
              y={y - 3}
              width={140 - i * 12}
              height="6"
              rx="3"
              className="fill-white/10"
              variants={{
                hidden: { scaleX: 0, originX: 0 },
                visible: {
                  scaleX: 1,
                  transition: { duration: 0.5, delay: i * 0.08 + 0.1 },
                },
                hover: {
                  fill: "rgba(255, 255, 255, 0.18)",
                  width: 140 - i * 12 + 10,
                  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            />
          </g>
        );
      })}
      <rect x="0" y="156" width="320" height="4" rx="2" className="fill-white/[0.06]" />
      <motion.rect
        x="0"
        y="156"
        width="248"
        height="4"
        rx="2"
        className="fill-secondary/70"
        variants={{
          hidden: { width: 0 },
          visible: {
            width: 248,
            transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.4 },
          },
        }}
      />
      <text x="0" y="176" className="fill-subtle font-mono text-[9px]">
        120/152 evals · 79%
      </text>
    </svg>
  );
}

/** Cinder — token waveform + a small chip motif. */
export function WaveformVisual() {
  const bars = [8, 18, 30, 44, 60, 78, 96, 74, 52, 38, 26, 16, 22, 34, 50, 68, 84, 58, 30, 14];
  return (
    <svg {...svgBase} aria-hidden="true">
      <g transform="translate(0, 40)">
        {bars.map((h, i) => (
          <motion.rect
            key={i}
            x={i * 15 + 6}
            y={50 - h / 2}
            width="6"
            height={h}
            rx="2"
            className={i % 5 === 0 ? "fill-secondary/80" : "fill-white/12"}
            variants={{
              hidden: { scaleY: 0, originY: 0.5 },
              visible: {
                scaleY: 1,
                transition: {
                  delay: i * 0.02,
                  duration: 0.4,
                  ease: "easeOut",
                },
              },
              hover: {
                scaleY: 1.25,
                opacity: 1,
                fill: i % 5 === 0 ? "rgba(6, 182, 212, 1)" : "rgba(255, 255, 255, 0.3)",
                transition: {
                  delay: i * 0.015,
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          />
        ))}
      </g>
      <motion.g
        transform="translate(128, 128)"
        className="stroke-border"
        strokeWidth="1"
        variants={{
          hover: {
            stroke: "rgba(6, 182, 212, 0.4)",
            transition: { duration: 0.3 },
          },
        }}
      >
        <rect x="0" y="0" width="64" height="34" rx="4" className="fill-transparent" />
        {[10, 24, 38, 52].map((x) => (
          <line key={`t${x}`} x1={x} y1="0" x2={x} y2="-6" />
        ))}
        {[10, 24, 38, 52].map((x) => (
          <line key={`b${x}`} x1={x} y1="34" x2={x} y2="40" />
        ))}
      </motion.g>
      <text x="128" y="150" className="fill-subtle font-mono text-[9px]">
        M2 · 62 tok/s
      </text>
    </svg>
  );
}

/** Loomstate — unstructured points resolving into a connected graph. */
export function GraphNetworkVisual() {
  const nodes = [
    { x: 46, y: 40 },
    { x: 100, y: 24 },
    { x: 160, y: 46 },
    { x: 220, y: 28 },
    { x: 270, y: 54 },
    { x: 70, y: 100 },
    { x: 140, y: 92 },
    { x: 200, y: 108 },
    { x: 250, y: 128 },
    { x: 110, y: 150 },
    { x: 180, y: 150 },
  ];
  const edges: [number, number][] = [
    [0, 5],
    [1, 5],
    [1, 6],
    [2, 6],
    [2, 7],
    [3, 7],
    [4, 7],
    [4, 8],
    [5, 9],
    [6, 9],
    [6, 10],
    [7, 10],
    [8, 10],
  ];
  return (
    <svg {...svgBase} aria-hidden="true">
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          className="stroke-white/10"
          strokeWidth={1}
          variants={{
            hidden: { pathLength: 0 },
            visible: {
              pathLength: 1,
              transition: { duration: 0.6, delay: i * 0.03 + 0.1, ease: "easeOut" },
            },
            hover: {
              stroke: "rgba(6, 182, 212, 0.25)",
              strokeWidth: 1.2,
              transition: { duration: 0.4, delay: i * 0.01 },
            },
          }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i > 8 ? 5 : 3.5}
          className={i > 8 ? "fill-primary/80" : "fill-white/25"}
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: {
              scale: 1,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: i * 0.03 + 0.2,
              },
            },
            hover: {
              scale: i > 8 ? 1.25 : 1.3,
              fill: i > 8 ? "rgba(139, 92, 246, 1)" : "rgba(255, 255, 255, 0.7)",
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 15,
                delay: i * 0.005,
              },
            },
          }}
        />
      ))}
    </svg>
  );
}

export const PROJECT_VISUALS = {
  "agent-trace": AgentTraceVisual,
  "terminal-evals": TerminalEvalsVisual,
  waveform: WaveformVisual,
  "graph-network": GraphNetworkVisual,
} as const;
