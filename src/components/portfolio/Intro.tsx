import { motion, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { EASE } from "@/lib/motion";

const WORDS = [
  { text: "Ideas.", weight: "font-semibold text-foreground" },
  {
    text: "Into.",
    weight: "font-normal italic text-muted-foreground font-serif-accent",
  },
  { text: "Systems.", weight: "font-semibold text-foreground" },
];

export function Intro({ onDone }: { onDone: () => void }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Last word finishes animating in at ~1.39s (2 × 0.32s stagger + 0.75s
    // duration). Hold on the completed phrase for ~550ms before exiting —
    // long enough to actually read as a pause, not a stutter.
    const holdDelay = reduceMotion ? 500 : 1950;
    const t = setTimeout(onDone, holdDelay);
    return () => clearTimeout(t);
  }, [onDone, reduceMotion]);

  return (
    <motion.div
      key="intro"
      exit={{
        opacity: 0,
        filter: reduceMotion ? "blur(0px)" : "blur(18px)",
        scale: 1.015,
      }}
      transition={{ duration: reduceMotion ? 0.3 : 0.65, ease: EASE }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background grain"
      aria-hidden="true"
    >
      <div className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-2 px-6 text-center">
        {WORDS.map((w, i) => (
          <motion.span
            key={w.text}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, filter: "blur(12px)" }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: reduceMotion ? 0.4 : 0.75,
              ease: EASE,
              delay: reduceMotion ? 0 : i * 0.32,
            }}
            className={`font-display text-5xl tracking-tight sm:text-6xl md:text-8xl ${w.weight}`}
          >
            {w.text}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
