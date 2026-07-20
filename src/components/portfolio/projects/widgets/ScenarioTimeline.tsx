import { motion } from "motion/react";

export function ScenarioTimeline({
  events,
}: {
  events: { t: string; event: string; danger?: boolean }[];
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-card p-6 shadow-lg">
      <span className="mb-6 block font-mono text-[9px] uppercase tracking-widest text-subtle">
        What actually happens
      </span>
      <div className="relative pl-6 border-l border-white/10 space-y-5">
        {events.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 30 }}
            className="relative"
          >
            <span
              className={`absolute -left-[27px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                e.danger ? "bg-red-500/20 border-red-500/50" : "bg-card border-white/15"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${e.danger ? "bg-red-400 animate-pulse" : "bg-secondary"}`}
              />
            </span>
            <div className="flex flex-wrap items-baseline gap-2">
              <span
                className={`font-mono text-[10px] font-bold uppercase tracking-widest ${
                  e.danger ? "text-red-400" : "text-secondary"
                }`}
              >
                {e.t}
              </span>
              <p
                className={`text-xs leading-relaxed ${e.danger ? "text-red-200/95 font-medium" : "text-foreground/80"}`}
              >
                {e.event}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
