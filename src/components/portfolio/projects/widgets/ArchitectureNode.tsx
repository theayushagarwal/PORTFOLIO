import { motion } from "motion/react";
import { useSpotlight } from "./useSpotlight";

/** Architecture pipeline node with mouse-tracking spotlight + staggered entrance */
export function ArchitectureNode({
  node,
  idx,
  glow,
}: {
  node: { id: string; label: string; desc: string };
  idx: number;
  glow: string;
}) {
  const { ref, onMove, background } = useSpotlight();
  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 260, damping: 26, delay: idx * 0.06 }}
      style={{ "--glow-color": glow } as React.CSSProperties}
      className="group/node relative overflow-hidden rounded-xl border border-white/10 bg-surface p-4 transition-colors duration-300 hover:border-secondary/40 hover:shadow-[0_0_15px_var(--glow-color)] cursor-default flex flex-col justify-between"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover/node:opacity-100"
        style={{ background }}
      />
      <div className="relative z-10">
        <span className="font-mono text-[9px] text-secondary font-bold uppercase tracking-wider block mb-1">
          0{idx + 1} // {node.id}
        </span>
        <h4 className="font-display font-semibold text-foreground text-sm">{node.label}</h4>
        <p className="mt-2 text-xs text-subtle leading-relaxed">{node.desc}</p>
      </div>
    </motion.div>
  );
}
