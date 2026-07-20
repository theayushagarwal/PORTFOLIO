import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/** Numbered step sequence with optional file chips — used for both `solutionSteps` and `fixSteps` */
export function StepSequence({
  steps,
  accent,
}: {
  steps: { step: string; detail?: string; file?: string }[];
  accent: string;
}) {
  return (
    <div className="relative pl-7 border-l border-white/10 space-y-6">
      {steps.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 28 }}
          className="relative"
        >
          <span
            style={{ "--accent": accent } as React.CSSProperties}
            className="absolute -left-[37px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-card border border-white/15 font-mono text-[10px] font-bold text-foreground"
          >
            {i + 1}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <h5 className="font-display font-semibold text-foreground text-[13px]">{s.step}</h5>
            {s.file && (
              <code className="rounded bg-white/5 border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-secondary">
                {s.file}
              </code>
            )}
          </div>
          {s.detail && (
            <p className="mt-1 text-xs leading-relaxed text-foreground/70">{s.detail}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}

/** Expandable accordion challenge cards */
export function ChallengeCard({
  index,
  challenge,
  active,
  onClick,
  accentGlow,
}: {
  index: number;
  challenge: {
    title: string;
    problem: string;
    difficulty: string;
    solution: string;
    fixSteps?: { step: string; detail?: string; file?: string }[];
    learned: string;
  };
  active: boolean;
  onClick: () => void;
  accentGlow: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-surface overflow-hidden transition-all duration-300 hover:border-white/20">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between p-5 text-left font-display font-semibold text-foreground hover:bg-white/[0.02]"
      >
        <span className="flex items-center gap-3">
          <span className="font-mono text-xs text-subtle">0{index + 1}.</span>
          {challenge.title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-subtle transition-transform duration-300 ${active ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 34, mass: 1 }}
          >
            <motion.div
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
              }}
              initial="hidden"
              animate="show"
              style={{ "--accent-glow": accentGlow } as React.CSSProperties}
              className="border-t border-white/5 bg-white/[0.03] backdrop-blur-md p-5 space-y-4 text-xs leading-relaxed text-muted-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]"
            >
              <motion.div
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="relative rounded-lg border-l-2 pl-3"
                style={{ borderColor: accentGlow }}
              >
                <span className="block font-mono text-[9px] uppercase tracking-widest text-subtle mb-1">
                  Problem
                </span>
                <p className="text-foreground/90 font-medium text-[13px]">{challenge.problem}</p>
              </motion.div>
              <div className="grid gap-4 sm:grid-cols-2">
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                >
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-subtle mb-1">
                    Why it was difficult
                  </span>
                  <p>{challenge.difficulty}</p>
                </motion.div>
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  className="sm:col-span-2"
                >
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-subtle mb-3">
                    The fix
                  </span>
                  {challenge.fixSteps ? (
                    <StepSequence steps={challenge.fixSteps} accent={accentGlow} />
                  ) : (
                    <p>{challenge.solution}</p>
                  )}
                </motion.div>
              </div>
              <motion.div
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="pt-2 border-t border-white/5"
              >
                <span className="block font-mono text-[9px] uppercase tracking-widest text-secondary/80 mb-1">
                  What I learned
                </span>
                <p className="text-secondary/90 italic">"{challenge.learned}"</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
